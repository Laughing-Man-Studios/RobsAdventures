import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getLabels,
  getOauth2Client,
  getToken,
  getAuthUrl,
} from "../../../common/serverFunctions";
import sessionOptions from "../../../common/session";
import { google } from "googleapis";
import { TokenError } from "../../../common/errors";
import { AuthMessage } from "../../../common/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | AuthMessage>
) {
  if (req.method === "GET") {
    const auth = getOauth2Client(res);
    try {
      await getToken(auth);
      const gmail = google.gmail({ version: "v1", auth });
      await getLabels(gmail);
      res.status(200).send({
        message: "Authenticated",
      });
    } catch (err) {
      if (err instanceof TokenError) {
        const authUrl = getAuthUrl(auth, err);
        res.status(401).send({
          message: "Need to authenticate",
          url: authUrl,
        });
      } else if (err instanceof Error) {
        res.status(500).send({
          message: err.toString(),
        });
      } else {
        console.log(err);
        res.status(500).end();
      }
    }
  } else {
    res.status(404).end();
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
