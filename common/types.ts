import { Pictures, Trip } from "@prisma/client";

export type ModifiedLocation = {
  id: number;
  gmailId: string;
  tripId: number;
  longitude: string;
  latitude: string;
  dateTime: string;
};

export type ModifiedMessage = {
  id: number;
  gmailId: string;
  tripId: number;
  message: string;
  dateTime: string;
};

export type AppProps = {
  page: string;
  tokenURL: string | null;
  apiKey: string;
  locations: ModifiedLocation[];
  messages: ModifiedMessage[];
  trips: Trip[];
  pictures: Pictures[]
};

export type NavProps = {
  trips: Trip[];
  page: string;
};

export type AuthMessage = {
  message: string;
  url?: string;
};
