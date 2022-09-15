import { Trip } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { createRef, FormEvent, useState } from "react";
import { toTitleCase } from "../../common/functions";
import { getTrips } from "../../common/serverFunctions";
import sessionOptions from "../../common/session";
import AdminMain from "../../components/admin/main";
import styles from "../../styles/Admin.module.css";

interface AdminTripsProps {
  trips: Trip[];
}

const AdminTrips: NextPage<AdminTripsProps> = ({ trips: originalTrips }) => {
  const select = createRef<HTMLSelectElement>();
  const [success, setSuccess] = useState(false);
  const [trips, setTrips] = useState(originalTrips);
  function deleteTrip() {
    fetch("/api/admin/trips", {
      method: "delete",
      body: JSON.stringify({ trip: select.current?.value }),
    })
      .then(() => {
        const deletedIndex = trips.findIndex(
          (trip) => trip.name === select.current?.value
        );
        if (deletedIndex > 0) {
          trips.splice(deletedIndex, 1);
          setTrips(trips);
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => console.log(err));
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    const input = e.currentTarget.elements.namedItem(
      "create"
    ) as HTMLInputElement;
    if (!input || !input.value) {
      return false;
    }
    input.value = input.value.replaceAll(" ", "_").toUpperCase();
    return true;
  }
  return (
    <AdminMain title="Admin Trip Editor">
      <div className={styles.tripContainer}>
        <form
          className={styles.tripFormContainer}
          action="/api/admin/trips"
          method="post"
          onSubmit={submit}
        >
          <label className={styles.tripItems} htmlFor="create">
            Create Trip
          </label>
          <input
            className={styles.tripItems}
            name="create"
            type="text"
            pattern="^[\w|_]*"
            required
          />
          <button className={styles.tripItems} type="submit">
            Save
          </button>
        </form>
        <div className={styles.tripFormContainer}>
          <label className={styles.tripItems} htmlFor="trips">
            Delete Trip
          </label>
          <select className={styles.tripItems} ref={select} name="trips">
            {trips.map((trip) => {
              return (
                <option key={trip.name} value={trip.name}>
                  {toTitleCase(trip.name.replaceAll("_", " "))}
                </option>
              );
            })}
          </select>
          <button className={styles.tripItems} onClick={deleteTrip}>
            Delete
          </button>
        </div>
        {success ? (
          <p className={styles.tripActionMessage}>Delete Successful</p>
        ) : null}
      </div>
      <form
          className={styles.tripFormContainer}
          action="/api/admin/pictures"
          method="post"
        >
          <label className={styles.tripItems} htmlFor="name">
            Update Photo Url
          </label>
          <select className={styles.tripItems} ref={select} name="name">
            {trips.map((trip) => {
              return (
                <option key={trip.name} value={trip.name}>
                  {toTitleCase(trip.name.replaceAll("_", " "))}
                </option>
              );
            })}
          </select>
          <input
            className={styles.tripItems}
            name="photosUrl"
            type="text"
            pattern="^https:\/\/photos.app.goo.gl\/\w*$"
            required
          />
          <button className={styles.tripItems} type="submit">
            Save
          </button>
        </form>
        <table className={styles.tripTable}>
          <thead className={styles.tripTableHead}>
            <tr>
              <th className={styles.tripNameColumn} scope="column">Name</th>
              <th scope="column">Url</th>
            </tr>
          </thead>
          <tbody>
            {
              trips.map(({ id, name, photosUrl}) => {
                return (
                  <tr key={id}>
                    <th scope="row">{name}</th>
                    <td className={styles.tripRow}>{photosUrl}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
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
    props: { trips: await getTrips() },
  };
},
sessionOptions);

export default AdminTrips;
