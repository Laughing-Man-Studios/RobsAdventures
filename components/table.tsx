import React from "react"
import { ModifiedLocation } from "../common/types"
import styles from "../styles/Map.module.css"

type TimeTable = {
    locations: ModifiedLocation[]
}

const timeTable: React.FC<TimeTable> = ({ locations }) => {
    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles['table-head']}>
                    <th scope="column" className={styles.idColumn}>Id</th>
                    <th scope="column">Time</th>
                </tr>
            </thead>
            <tbody>
            {
                locations.map(({ id, createdAt }) => {
                    return (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td className={styles.row}>{createdAt}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    );
}

export default timeTable;