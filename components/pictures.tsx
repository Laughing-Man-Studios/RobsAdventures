import styles from "../styles/Pictures.module.css";
import { Pictures } from "@prisma/client";

type PicturesProps = {
    pictures: Pictures[]
    link: string
}

const Pictures: React.FC<PicturesProps> = ({ pictures, link }) => {
    return (
        <div className={styles.container}>
            <a className={styles.link} href={link}>Go to Google Pictures</a>
            { pictures.map(pic => (
                <img className={styles.img} key={pic.url} src={pic.url} alt="Hiking Picture"/>
            ))}
        </div>
    )
}

export default Pictures;