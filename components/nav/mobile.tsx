import Link from 'next/link';
import { useState } from 'react';
import { NavProps } from '../../common/types';
import styles from '../../styles/Nav.module.css';

const MobileNav: React.FC<NavProps> = ({ trips, page }) => {
    const [navbarOpen, setNavBarOpen] = useState(false);
    const handleToggle = () => {
      setNavBarOpen(prev => !prev);
    };
    const handleClose = () => {
      setNavBarOpen(false);
    }
    let navList = null;
    if (navbarOpen) {
      navList = (
        <ul className={styles.mobileNavList}>
          { trips.map(({ name }) => {
              const href = name.toLowerCase();
              const display = name.split('_').map(substr => {
                const str = substr.toLowerCase();
                return str.charAt(0).toUpperCase() + str.slice(1);
              }).join(' ');
              return (
                <li key={name} className={styles.navLinkContainer}>
                  { name === page && <div className={styles.rightEqui}/>}        
                  <Link href={`/trips/${href}`}>
                    <a className={styles.linkCenter} onClick={handleClose}>{display}</a>
                  </Link>
                </li>
              );
            }) }
        </ul>
      );
    }
    return (
      <nav className={styles.mobileNav}>
        <button className={styles.hamburger} onClick={handleToggle}>
          <div className={styles.hamburgerLayer}></div>
          <div className={styles.hamburgerLayer}></div>
          <div className={styles.hamburgerLayer}></div>
        </button>
        { navList }
      </nav>
    );
}

export default MobileNav;