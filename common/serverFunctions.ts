import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { NextApiResponse } from "next";
import { AuthMessage, ModifiedLocation, ModifiedMessage } from "./types";
import { PrismaClient, Trip, Authentication } from "@prisma/client";
import { GMAIL_TOKEN_FLAG, GMAIL_TOKEN_VAR } from "./literals";
import { TokenError } from "./errors";
import { GaxiosError } from "gaxios";
import { FunctionalError } from "./errors";
import { APIError } from "./errors";
export { toTitleCase, labelToDatabaseName } from "./functions";
const prisma = new PrismaClient();

export function getOauth2Client(
  res: NextApiResponse<string | AuthMessage>
): OAuth2Client {
  const { GOOGLE_CREDENTIALS } = process.env;
  if (GOOGLE_CREDENTIALS) {
    const { client_secret, client_id, redirect_uris } =
      JSON.parse(GOOGLE_CREDENTIALS).web;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  }
  res.status(500).send("Failed. No OAuth2Client");
  throw new FunctionalError(`Unable to create OAuth2Client. 
    Check that Google Credentials have have been 
    added to the enviornment variable GOOGLE_CREDIENTIALS`);
}

export async function getToken(oAuth2Client: OAuth2Client) {
  const tokenEntry = await getTokenFromDB();
  if (tokenEntry) {
    const token = JSON.parse(tokenEntry.value.toString());
    if (!token.refresh_token) {
      token.refresh_token = tokenEntry.reauth;
    }
    oAuth2Client.setCredentials(token);
  } else {
    throw new TokenError(
      'Failed to get token. GMAIL_TOKEN is not set. Need to authenticate with Google.'
    );
  }
}

async function getTokenFromDB(): Promise<Authentication | null> {
  try {
    const token = await prisma.authentication.findFirst({
      where: {
        name: GMAIL_TOKEN_VAR,
      },
    });
    await prisma.$disconnect();
    return token;
  } catch (err) {
    throw new APIError(`Failed to get Token From Database -> ${err}`);
  }
}

export async function getLabels(
  gmail: gmail_v1.Gmail
): Promise<Map<string, string>> {
  const labelMap = new Map();
  let data = null;
  try {
    data = (await gmail.users.labels.list({ userId: "me" })).data;
  } catch (err) {
    if (
      err instanceof GaxiosError &&
      err.response?.status === 400 &&
      err.response.data.error === "invalid_grant"
    ) {
      throw new TokenError(err.toString());
    } else {
      throw new APIError(`Unable to get labels from from gmail -> ${err}`);
    }
  }

  if (!data || !data.labels) {
    throw new FunctionalError(
      "No Labels in Gmail account! Gmail (or Google API) is screwed up!"
    );
  }
  for (const label of data.labels) {
    if (label && label.name && label.name.includes("Zoleo/")) {
      labelMap.set(label.name, label.id);
    }
  }
  return labelMap;
}

export function getAuthUrl(oAuth2Client: OAuth2Client, err: unknown): string {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  process.env[GMAIL_TOKEN_FLAG] = authUrl;
  console.log(
    "No Token Available. Need to Authenticate with Google to get Token file. Err: " +
      err
  );
  return authUrl;
}

export async function getLocations(trip: string): Promise<ModifiedLocation[]> {
  try {
    const locationData = await prisma.location.findMany({
      where: {
        trip: {
          name: trip.toUpperCase(),
        },
      },
    });
    await prisma.$disconnect();
  
    locationData.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  
    return locationData.map(
      ({ id, gmailId, tripId, longitude, latitude, dateTime }) => {
        return {
          id,
          gmailId,
          tripId,
          longitude,
          latitude,
          dateTime: dateTime.toString(),
        };
      }
    );
  } catch (err) {
    throw new APIError(`Unable to get Locations for ${trip} -> ${err}`);
  }
}

export async function getMessages(trip: string): Promise<ModifiedMessage[]> {
  try {
    const messageData = await prisma.messages.findMany({
      where: {
        trip: {
          name: trip.toUpperCase(),
        },
      },
    });
  
    await prisma.$disconnect();
  
    messageData.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  
    return messageData.map(({ id, gmailId, tripId, message, dateTime }) => {
      return {
        id,
        gmailId,
        tripId,
        message,
        dateTime: dateTime.toString(),
      };
    });
  } catch (err) {
    throw new APIError(`Unable to get Messages for ${trip} -> ${err}`);
  }

}

export async function getTrips(): Promise<Trip[]> {
  try {
    const trips = await prisma.trip.findMany();
    await prisma.$disconnect();
  
    return trips;
  } catch (err) {
    throw new APIError(`Unable to get Trips -> ${err}`);
  }

}

export async function addTrips(names: string[]): Promise<void> {
  let tripNames = [];
  try {
    tripNames = (await getTrips()).map((trip) => trip.name);
  } catch (err) {
    throw new APIError(`Unable to get trips for addTrips -> ${err}`);
  }
  for (const name of names) {
    try {
      if (!tripNames.includes(name)) {
        console.log("Creating trip entry for " + name);
        await prisma.trip.create({
          data: {
            name: name,
            zoom: 3,
            lng: 0,
            lat: 0,
          },
        });
      }
    } catch (err) {
      throw new APIError(`Unable to add trip: ${trip} -> ${err}`);
    }
  }
}
