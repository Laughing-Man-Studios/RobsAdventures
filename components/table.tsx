import React from "react"
import { ModifiedLocation } from "../common/types"
import styles from "../styles/Map.module.css"

type TimeTable = {
    locations: ModifiedLocation[]
}

const TimeTable: React.FC<TimeTable> = ({ locations }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles['table-head']}>
                        <th scope="column" className={styles.idColumn}>Id</th>
                        <th scope="column">Time</th>
                    </tr>
                </thead>
                <tbody>
                {
                    locations.map(({ id, dateTime }) => {
                        return (
                            <tr key={id}>
                                <th scope="row">{id}</th>
                                <td className={styles.row}>{dateTime}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    );
}

export default TimeTable;