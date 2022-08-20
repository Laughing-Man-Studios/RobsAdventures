import { IronSessionOptions } from 'iron-session';

const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'robs-adventure/admin',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
};

declare module 'iron-session' {
    interface IronSessionData {
      loggedIn: boolean
    }
  }

export default sessionOptions;