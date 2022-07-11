// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import { promises } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOauth2Client } from '../../common/functions';
import { GMAIL_TOKEN_FLAG, GMAIL_TOKEN_VAR } from '../../common/literals';
const prisma = new PrismaClient(); 

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
    await setTokenInDB(JSON.stringify(token.tokens));
    delete process.env[GMAIL_TOKEN_FLAG];
    res.status(301).redirect('/');
  } catch(err) {
    console.log('Error retrieving and storing access code: '+err);
    res.status(500).send('Failed to Authenticate');
  }
}

async function setTokenInDB(token: string) {
  await prisma.authentication.upsert({
    where: {
      name: GMAIL_TOKEN_VAR
    },
    update: {
      value: token
    },
    create: {
      name: GMAIL_TOKEN_VAR,
      value: token
    }
  });
  prisma.$disconnect();
}
