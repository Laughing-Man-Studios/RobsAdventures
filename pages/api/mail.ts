// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Labels, LabelsList, DEFAULT_TRIP } from "../../common/literals";
import {
  getOauth2Client,
  labelToDatabaseName,
  addTrips,
  getToken,
  getLabels,
  getAuthUrl,
} from "../../common/serverFunctions";
import { AuthMessage } from "../../common/types";
import { OAuth2Client } from "google-auth-library";
import { gmail_v1, google } from "googleapis";
import { TokenError } from "../../common/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LocationData {
  longitude: string;
  latitude: string;
}

function getTripLabel(
  tripLabelMap: Map<string, string>,
  labelIds: string[] | undefined
): string {
  if (labelIds) {
    return (
      tripLabelMap.get(
        Array.from(tripLabelMap.keys()).filter((tripLabel) =>
          labelIds.includes(tripLabel)
        )[0]
      ) || DEFAULT_TRIP
    );
  }
  return DEFAULT_TRIP;
}

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: NextApiResponse<string | AuthMessage>
) {
  const oAuth2Client = getOauth2Client(res);
  try {
    await getToken(oAuth2Client);
    await getAndSaveMail(oAuth2Client);
    res.status(200).send("Success");
  } catch (err) {
    if (err instanceof TokenError) {
      getAuthUrl(oAuth2Client, err);
    } else {
      console.log("Not token error");
      console.log(err);
    }
    res.status(500).send(err as string);
  }
}

async function getAndSaveMail(auth: OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth });
  console.log("got gmail instance");
  const labelMap = await getLabels(gmail);
  console.log("got label map");
  await updateTrips(labelMap);
  console.log("updated trips");
  await saveLocationMessages(labelMap, gmail);
  console.log("saved locations");
  await saveUpdateMessages(labelMap, gmail);
  console.log("saved blog messages");
}

function getLocationData(snippit: string): LocationData {
  const [, latitude, longitude] =
    snippit.match(/(?<=My location is )(.\d*.\d*), (.\d*.\d*)/) || [];

  return {
    latitude,
    longitude,
  };
}

async function updateTrips(labelMap: Map<string, string>): Promise<void> {
  const tripNames = Array.from(labelMap.keys())
    .filter((label) => !LabelsList.includes(label as Labels))
    .map((label) => labelToDatabaseName(label));
  await addTrips(tripNames);
}

async function saveLocationMessages(
  labelMap: Map<string, string>,
  gmail: gmail_v1.Gmail
): Promise<void> {
  const locationLabelId = labelMap.get(Labels.Location);
  const tripLabelMap = new Map(
    Array.from(labelMap)
      .filter((label) => !LabelsList.includes(label[0] as Labels))
      .map((label) => [label[1], labelToDatabaseName(label[0])])
  );

  if (locationLabelId) {
    const resp = await gmail.users.messages.list({
      userId: "me",
      labelIds: [locationLabelId],
    });
    console.log("got messages list");
    const { messages: locationMessages } = resp.data;

    if (locationMessages && locationMessages.length > 0) {
      for (const message of locationMessages) {
        try {
          const messageEntry = await prisma.location.findFirst({
            where: {
              gmailId: message.id,
            },
          });
          await prisma.$disconnect();
          if (messageEntry) {
            console.log(`Location Message ${message.id} already exists in db.`);
            continue;
          }
        } catch (err) {
          console.log(err);
        }
        const { data } = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const parts = data.payload?.parts;
        if (parts && Array.isArray(parts)) {
          const encodedMessage = parts[0].body?.data || "";
          const messageText = Buffer.from(encodedMessage, "base64").toString();
          const tripName = getTripLabel(tripLabelMap, data.labelIds);
          const { latitude, longitude } = getLocationData(messageText || "");

          console.log(
            `Adding location message: ${message.id} to trip: ${tripName}`
          );

          if (latitude && longitude) {
            try {
              await prisma.location.create({
                data: {
                  gmailId: data.id || "",
                  trip: {
                    connect: { name: tripName },
                  },
                  dateTime:
                    data.internalDate && !Number.isNaN(data.internalDate)
                      ? new Date(Number(data.internalDate))
                      : new Date(),
                  latitude,
                  longitude,
                },
              });
            } catch (err) {
              console.log(err);
            }
          }

          await prisma.$disconnect();
        }
      }
    }
  }
}

async function saveUpdateMessages(
  labelMap: Map<string, string>,
  gmail: gmail_v1.Gmail
): Promise<void> {
  const updateLabelId = labelMap.get(Labels.Messages);
  const tripLabelMap = new Map(
    Array.from(labelMap)
      .filter((label) => !LabelsList.includes(label[0] as Labels))
      .map((label) => [label[1], labelToDatabaseName(label[0])])
  );

  if (updateLabelId) {
    const resp = await gmail.users.messages.list({
      userId: "me",
      labelIds: [updateLabelId],
    });
    const { messages: updateMessages } = resp.data;

    if (updateMessages && updateMessages.length > 0) {
      for (const message of updateMessages) {
        try {
          const messageEntry = await prisma.messages.findFirst({
            where: {
              gmailId: message.id,
            },
          });
          await prisma.$disconnect();
          if (messageEntry) {
            console.log(`Update Message ${message.id} already exists in db.`);
            continue;
          }
        } catch (err) {
          console.log(err);
        }
        const { data } = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const parts = data.payload?.parts;
        if (parts && Array.isArray(parts)) {
          const encodedMessage = parts[0].body?.data || "";
          const messageText = Buffer.from(encodedMessage, "base64").toString();
          const tripName = getTripLabel(tripLabelMap, data.labelIds);

          console.log(
            `Adding update message: ${message.id} to trip: ${tripName}`
          );

          try {
            await prisma.messages.create({
              data: {
                gmailId: data.id || "",
                trip: {
                  connect: { name: tripName },
                },
                dateTime:
                  data.internalDate && !Number.isNaN(data.internalDate)
                    ? new Date(Number(data.internalDate))
                    : new Date(),
                message: messageText,
              },
            });
          } catch (err) {
            console.log(err);
          }

          await prisma.$disconnect();
        }
      }
    }
  }
}
