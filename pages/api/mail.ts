// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CURRENT_TRIP, Labels, LabelsList, GMAIL_TOKEN_FLAG, GMAIL_TOKEN_VAR } from '../../common/literals';
import { getOauth2Client } from '../../common/functions';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';
import { TokenError } from '../../common/errors';
import { Authentication, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface LocationData {
  longitude: string,
  latitude: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
    const oAuth2Client = getOauth2Client(res);  
    try {
      await getToken(oAuth2Client);
      console.log('got token');
      await getAndSaveMail(oAuth2Client);
      res.status(200).send('Success');
    } catch (err) {
      if (err instanceof TokenError) {
        getAuthUrl(oAuth2Client, err);
      } else {
        console.log('Not token error');
      }
      res.status(500).send('Failed to get gmail ');
    }
}

async function getToken(oAuth2Client: OAuth2Client) {
  const token = await getTokenFromDB();
  if (token) {
    oAuth2Client.setCredentials(JSON.parse(token.value.toString()));
  } else {
    throw new TokenError('GMAIL_TOKEN is not set. Need to authenticate with Google.');
  }
}

async function getTokenFromDB(): Promise<Authentication | null> {
  return await prisma.authentication.findFirst({
    where: {
      name: GMAIL_TOKEN_VAR
    }
  })
}

function getAuthUrl(oAuth2Client: OAuth2Client, err: unknown) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  process.env[GMAIL_TOKEN_FLAG] = authUrl;
  console.log('No Token Available. Need to Authenticate with Google to get Token file. Err: '+err);
}

async function getAndSaveMail(auth: OAuth2Client) {
  const gmail = google.gmail({version: 'v1', auth});
  console.log('got gmail instance');
  const labelMap = await getLabels(gmail);
  console.log('got label map');
  await saveLocationMessages(labelMap, gmail);
  console.log('saved locations');
  await saveUpdateMessages(labelMap, gmail);
  console.log('saved blog messages');
}

async function getLabels(gmail: gmail_v1.Gmail): Promise<Map<string, string>> {
  const labelMap = new Map();
  const { data } = await gmail.users.labels.list({ userId: 'me' });
  if (!data.labels) {
    throw new Error('No Labels in Gmail account! Gmail (or Google API) is screwed up!');
  }
  for(let label of data.labels) {
    if(label && LabelsList.includes(label.name as Labels)) {
      labelMap.set(label.name, label.id);
    }
  }
  return labelMap;
}

function getLocationData(snippit: string): LocationData {
  const [fullMatch, latitude, longitude] = snippit.match(/(?<=My location is )(.\d*.\d*), (.\d*.\d*)/) || [];
  
  return {
    latitude,
    longitude
  };
}

async function saveLocationMessages(
  labelMap: Map<string, string>,
  gmail: gmail_v1.Gmail): Promise<void> {
  const locationLabelId = labelMap.get(Labels.Location);
  
  if (locationLabelId) {
    const resp = await gmail.users.messages.list({ userId: 'me', labelIds:[locationLabelId] });
    console.log('got messages list);
    const { messages: locationMessages } = resp.data;

    if (locationMessages && locationMessages.length > 0) {
      for(let message of locationMessages) {
        try {
          const messageEntry = await prisma.location.findFirst({
            where: {
              gmailId: message.id
            }
          });
          await prisma.$disconnect();
          if (messageEntry) {
            console.log(`Location Message ${message.id} already exists in db.`);
            continue;
          }
        } catch(err) {
          console.log(err);
        }
        const { data } = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });
        const parts = data.payload?.parts;
        if (parts && Array.isArray(parts)) {
          const encodedMessage = parts[0].body?.data || '';
          const message = Buffer.from(encodedMessage, 'base64').toString();

          const { latitude, longitude } = getLocationData(message || '');
          try {
            await prisma.location.create({
              data: {
                gmailId: data.id || '',
                trip: {
                  connect: { name: CURRENT_TRIP }
                },
                latitude,
                longitude
              }
            })
          } catch(err) {
            console.log(err);
          }
  
          await prisma.$disconnect();
        }
      }
    }
  }
}

async function saveUpdateMessages(
  labelMap: Map<string, string>,
  gmail: gmail_v1.Gmail): Promise<void> {
  const updateLabelId = labelMap.get(Labels.Messages);

  if (updateLabelId) {
    const resp = await gmail.users.messages.list({ userId: 'me', labelIds:[updateLabelId] });
    const { messages: updateMessages } = resp.data;

    if (updateMessages && updateMessages.length > 0) {
      for(let message of updateMessages) {
        try {
          const messageEntry = await prisma.messages.findFirst({
            where: {
              gmailId: message.id
            }
          })
          await prisma.$disconnect();
          if (messageEntry) {
            console.log(`Update Message ${message.id} already exists in db.`);
            continue;
          }
        } catch(err) {
          console.log(err);
        }
        const { data } = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });
        const parts = data.payload?.parts;
        if (parts && Array.isArray(parts)) {
          const encodedMessage = parts[0].body?.data || '';
          const message = Buffer.from(encodedMessage, 'base64').toString();

          try {
            await prisma.messages.create({
              data: {
                gmailId: data.id || '',
                trip: {
                  connect: { name: CURRENT_TRIP }
                },
                message
              }
            })
          } catch(err) {
            console.log(err);
          }
  
          await prisma.$disconnect();
        }
      }
    }
  }
}
