// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOauth2Client } from "../../common/serverFunctions";
import { GMAIL_TOKEN_FLAG, GMAIL_TOKEN_VAR } from "../../common/literals";
import { Credentials } from "google-auth-library";
import { AuthMessage } from "../../common/types";
import { GaxiosError } from "gaxios";
import { APIError, FunctionalError } from "../../common/errors";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: NextApiResponse<string | AuthMessage>
) {
  const { code } = req.query;
  console.log('Query code: ' + code);
  const codeStr = Array.isArray(code) ? code[0] : code;
  console.log('Query code string: ' + codeStr);
  const oAuth2Client = getOauth2Client(res);

  try {
    const token = await oAuth2Client.getToken(codeStr);
    console.log('Token: ' + JSON.stringify(token));
    oAuth2Client.setCredentials(token.tokens);
    console.log("Just set oAuth creds. Now setting in DB");
    await setTokenInDB(token.tokens);
    console.log('Just set in DB');
    delete process.env[GMAIL_TOKEN_FLAG];
    res.status(301).redirect("/");
  } catch (err) {
    if (err instanceof GaxiosError) {
      const data = err.response?.data;
      res.status(500).send("Failed to Authenticate");
      throw new APIError(`Label fetch request failed -> Err: ${data.error} | Desc: ${data.error_description}`);
    }
    res.status(500).send("Failed to Authenticate");
    throw new FunctionalError("Error retrieving and storing access code: " + err);
  }
}

async function setTokenInDB(token: Credentials) {
  const strToken = JSON.stringify(token);
  if (token.refresh_token) {
    await prisma.authentication.upsert({
      where: {
        name: GMAIL_TOKEN_VAR,
      },
      update: {
        value: strToken,
        reauth: token.refresh_token,
      },
      create: {
        name: GMAIL_TOKEN_VAR,
        value: strToken,
        reauth: token.refresh_token,
      },
    });
  } else {
    await prisma.authentication.upsert({
      where: {
        name: GMAIL_TOKEN_VAR,
      },
      update: {
        value: strToken,
      },
      create: {
        name: GMAIL_TOKEN_VAR,
        value: strToken,
      },
    });
  }
  prisma.$disconnect();
}
