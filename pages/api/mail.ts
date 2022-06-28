// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises } from 'fs'
import { TOKEN_FLAG, TOKEN_PATH } from '../common/literals';
import { getOauth2Client } from '../common/functions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
    const oAuth2Client = getOauth2Client(res);  
    try {
      const token = await promises.readFile(TOKEN_PATH);
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      res.status(200).send('Success');
    } catch (err) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
      });
      process.env[TOKEN_FLAG] = authUrl;
      console.log('No Token Available. Need to Authenticate with Google to get Token file. Err: '+err);
      res.status(500).send('Failed. No Token Available.');
    }
}