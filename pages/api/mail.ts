// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import { promises } from 'fs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
    if (process.env.GOOGLE_CREDENTIALS) {
      const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.GOOGLE_CREDENTIALS).web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

        try {
          const token = await promises.readFile('token.js');
          oAuth2Client.setCredentials(JSON.parse(token.toString()));
          res.status(200).send('Success');
        } catch (err) {
          const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly'],
          });
          process.env['AUTH_ROUTE'] = authUrl;
          console.log('No Token Available. Need to Authenticate with Google to get Token file. Err: '+err);
          res.status(500).send('Failed');
        }
    } else {
        res.status(500).send('Failed')
        console.log('No Credentials Available for OAuth with Google APIs');
    }
}