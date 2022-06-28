import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { NextApiResponse } from 'next';


export function getOauth2Client(res: NextApiResponse<String>): OAuth2Client {
  const { GOOGLE_CREDENTIALS } = process.env;
  if (GOOGLE_CREDENTIALS) {
    const {client_secret, client_id, redirect_uris} = JSON.parse(GOOGLE_CREDENTIALS).web;
    return new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  } 
  res.status(500).send('Failed. No OAuth2Client');
  throw new Error('Unable to create OAuth2Client. Check that Google Credentials have have been added to the enviornment variable GOOGLE_CREDIENTIALS');
}