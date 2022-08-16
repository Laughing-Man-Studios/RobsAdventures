import Link from "next/link";
import { NavProps } from "../../common/types";
import styles from "../../styles/Nav.module.css";

const WebNav: React.FC<NavProps> = ({ trips, page }) => {
    return (
    <nav className={styles.nav}>
        <span className={styles.navLabel}>Navigation</span>
        { trips.map(({ name }) => {
          const href = name.toLowerCase();
          const display = name.split('_').map(substr => {
            const str = substr.toLowerCase();
            return str.charAt(0).toUpperCase() + str.slice(1);
          }).join(' ');
          return (
            <div key={name} className={styles.linkContainer}>
              { name === page && <div className={styles.rightEqui}/>}        
              <Link href={`/trips/${href}`}>
                <a>{display}</a>
              </Link>
            </div>
          );
        }) }
      </nav>
    );
}

export default WebNav;