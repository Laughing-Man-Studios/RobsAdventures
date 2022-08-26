import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import styles from '../../styles/Admin.module.css';

interface AdminMainProps {
    title: string;
}

const AdminMain: 
    React.FC<PropsWithChildren<AdminMainProps>> = ({ title, children }) => {
    const router = useRouter();
    function logout() {
        fetch('/api/admin/login', { method: 'delete' })
            .catch(err => console.log(err))
            .finally(() => {
                router.push('/admin/login');
            });
    }
    
    return (
        <div className={styles.mainContainer}>
            <nav className={styles.mainNav}>
                <ul className={styles.mainList}>
                    <li className={styles.mainLinkItem}><Link href='/'><a>Home</a></Link></li>
                    <li className={styles.mainLinkItem}><Link href='/admin/map'><a>Map</a></Link></li>
                    <li className={styles.mainLinkItem}><Link href='/admin/trips'><a>Trips</a></Link></li>
                    <li className={styles.mainLinkItem}><Link href='/admin/pictures'><a>Pictures</a></Link></li>
                    <li className={styles.mainLogout} onClick={logout}>Logout</li>
                </ul>
            </nav>
            <div className={styles.mainContentWrapper}>
                <h1 className={styles.mainTitle}>{title}</h1>
                <div className={styles.mainContent}>{children}</div>
            </div>
        </div>
    );
};

export default AdminMain;