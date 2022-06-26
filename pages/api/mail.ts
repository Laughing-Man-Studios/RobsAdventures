// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import { promises } from 'fs'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (process.env.GOOGLE_CREDENTIALS) {
        const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

          try {
            const token = await promises.readFile('token.js');
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
          } catch (err) {
            const authUrl = oAuth2Client.generateAuthUrl({
              access_type: 'offline',
              scope: ['https://www.googleapis.com/auth/gmail.readonly'],
            });
          }
    } else {
        res.status(500)
        console.log('No Credentials Available for OAuth with Google APIs');
    }
}