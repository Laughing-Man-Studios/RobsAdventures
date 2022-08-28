import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { useState } from "react";
import sessionOptions from "../../common/session";
import AdminMain from "../../components/admin/main";
import styles from "../../styles/Admin.module.css";

interface AdminAuthProps {
  authUrl: string;
}

const AdminAuth: NextPage<AdminAuthProps> = ({ authUrl }) => {
  const [status, setStatus] = useState("");
  async function checkAuth() {
    const res = await fetch("/api/admin/auth", {
      method: "get",
    });

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
    },
  };
},
sessionOptions);

export default AdminAuth;
