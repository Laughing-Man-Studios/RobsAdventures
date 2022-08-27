import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next/types";
import sessionOptions from "../../../common/session";

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method === "POST") {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
      req.session.loggedIn = true;
      await req.session.save();
      return res.redirect("/admin/map");
    }
    return res.status(403).send("You have entered in the wrong password.");
  } else if (req.method === "DELETE") {
    req.session && req.session.destroy();
    res.redirect("/admin/login");
  }
  return res.status(404).end();
}

export default withIronSessionApiRoute(handler, sessionOptions);
