import styles from "../styles/Pictures.module.css";

type Pictures = {
    pictures: string[]
    link: string
}

const Pictures: React.FC<Pictures> = ({ pictures, link }) => {
    return (
        <div className={styles.container}>
            <a href={link}>Go to Google Pictures</a>
            { pictures.map(pic => (<img src={pic}/>))}
        </div>
    )
}

export default Pictures;