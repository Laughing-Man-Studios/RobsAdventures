// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises } from 'fs'
import { Labels, LabelsList, TOKEN_FLAG, TOKEN_PATH } from '../../common/literals';
import { getOauth2Client } from '../../common/functions';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';
import { TokenError } from '../../common/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
    const oAuth2Client = getOauth2Client(res);  
    try {
      await getToken(oAuth2Client);
      await getMail(oAuth2Client);
      res.status(200).send('Success');
    } catch (err) {
      if (err instanceof TokenError) {
        getAuthUrl(oAuth2Client, err);
      } else {
        console.log(err);
      }
      res.status(500).send('Failed. Error getting mail from Gmail.');
    }
}

async function getToken(oAuth2Client: OAuth2Client) {
  try {
    const token = await promises.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
  } catch (err) {
    throw new TokenError(err as string);
  }
}

function getAuthUrl(oAuth2Client: OAuth2Client, err: unknown) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  process.env[TOKEN_FLAG] = authUrl;
  console.log('No Token Available. Need to Authenticate with Google to get Token file. Err: '+err);
}

async function getMail(auth: OAuth2Client) {
  const gmail = google.gmail({version: 'v1', auth});
  const labelMap = getLabels(gmail);
  // TODO: Fill out rest of getting mail with right lables

}

async function getLabels(gmail: gmail_v1.Gmail): Promise<Map<String, String>> {
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