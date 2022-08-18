import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { NextApiResponse } from 'next';
import { ModifiedLocation, ModifiedMessage } from '../common/types'
import { PrismaClient, Trip } from '@prisma/client'

const prisma = new PrismaClient(); 

export function toTitleCase(text: string): string {
  return text.toLowerCase()
    .split(' ')
    .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export function labelToDatabaseName(text: string) {
  return text.split('/')[1].replaceAll(' ','_').toUpperCase();
}

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


export async function getLocations(trip: String): Promise<ModifiedLocation[]> {
  const locationData = await prisma.location.findMany({
    where: {
      trip: {
        name: trip.toUpperCase()
      }
    }
  });
  await prisma.$disconnect();

  locationData.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  return locationData.map((
    {id, gmailId, tripId, longitude, latitude, dateTime}
  ) => {
    return {
      id,
      gmailId,
      tripId,
      longitude,
      latitude,
      dateTime: dateTime.toString()
    }
  });
}

export async function getMessages(trip: string): Promise<ModifiedMessage[]> {
  const messageData = await prisma.messages.findMany({
    where: {
      trip: {
        name: trip.toUpperCase()
      }
    }
  });

  await prisma.$disconnect();

  messageData.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  return messageData.map((
    {id, gmailId, tripId, message, dateTime}
  ) => {
    return {
      id,
      gmailId,
      tripId,
      message,
      dateTime: dateTime.toString()
    }
  })
}

export async function getTrips(): Promise<Trip[]> {
  const trips = await prisma.trip.findMany();
  await prisma.$disconnect();

  return trips;
}

export async function addTrips(names: string[]): Promise<void> {
  const tripNames = (await getTrips()).map(trip => trip.name);
  for (const name of names) {
    if (!tripNames.includes(name)) {
      console.log('Creating trip entry for '+name);
      await prisma.trip.create({
        data: {
          name: name,
          zoom: 3,
          lng: 0,
          lat: 0
        }
      });
    }
  }

}
