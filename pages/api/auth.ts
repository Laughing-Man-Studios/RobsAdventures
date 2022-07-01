// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOauth2Client } from '../../common/functions';
import { TOKEN_FLAG, TOKEN_VAR } from '../../common/literals';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const { code } = req.query;
  const codeStr = Array.isArray(code) ? code[0] : code; 
  const oAuth2Client = getOauth2Client(res);
  try {
    const token = await oAuth2Client.getToken(codeStr);
    oAuth2Client.setCredentials(token.tokens);
    process.env[TOKEN_VAR] = JSON.stringify(token.tokens);
    delete process.env[TOKEN_FLAG];
    res.status(301).redirect('/');
  } catch(err) {
    console.log('Error retrieving and storing access code: '+err);
    res.status(500).send('Failed to Authenticate');
  }
}
