import { Authentication } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { useState } from "react";
import { getAuthData } from "../../common/serverFunctions";
import sessionOptions from "../../common/session";
import AdminMain from "../../components/admin/main";
import styles from "../../styles/Admin.module.css";

interface AdminAuthProps {
  authUrl: string;
  authData: Authentication[]
}

const AdminAuth: NextPage<AdminAuthProps> = ({ authUrl, authData }) => {
  const [status, setStatus] = useState("");
  async function checkAuth() {
    const res = await fetch("/api/admin/auth", {
      method: "get",
    });

    if (!Array.isArray(authData)) {
      console.log('AuthData: ' + authData);
      authData = [];
    }

    const json = await res.json();
    switch (res.status) {
      case 200:
        setStatus("Authenticated");
        break;
      case 401:
        setStatus(json.message);
        authUrl = json.authUrl;
        break;
      case 500:
        setStatus(json);
        break;
      default:
        setStatus("Nothing to see here. Move along.");
    }
  }
  return (
    <AdminMain title="Admin Check Authentication">
      {authUrl ? (
        <a className={styles.authUrl} href={authUrl}>
          Click to Authenticate
        </a>
      ) : null}
      <button onClick={checkAuth}>Check Authentication</button>
      {status ? <p>{status}</p> : null}
      <div className={styles.authDataContainer}>
        <h3>Authentication Data</h3>
        { authData.map( data => {
          return (
            <p>Name: {data.name} Reauth: {data.reauth} Value: {data.value}</p>
          );
        })}
      </div>
    </AdminMain>
  );
};

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  if (!req.session.loggedIn) {
    res.statusCode = 401;
    res.end();
  }
  return {
    props: {
      authUrl: process.env.AUTH_ROUTE || null,
      authData: getAuthData()
    },
  };
},
sessionOptions);

export default AdminAuth;
