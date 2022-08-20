import { withIronSessionSsr } from 'iron-session/next';
import { NextPage } from 'next';
import sessionOptions from '../../common/session';
import styles from '../../styles/Admin.module.css';

const Login: NextPage = () => {
    return(
        <div>
            <h1 className={styles.loginTitle}>Admin Login</h1>
            <form className={styles.loginForm} action='/api/admin/login' method='post'>
                <label className={styles.loginSpacing} htmlFor='password'>Password</label>
                <input 
                    className={styles.loginSpacing}
                    type='password'
                    name='password'
                    required
                    minLength={16}
                    maxLength={16}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>

    );
};

export const getServerSideProps = withIronSessionSsr(
    async function({ req }) {
     if (req.session.loggedIn) {
        return {
            props: {},
            redirect: {
                destination: '/admin/map'
            }
        };
     }
     return {
         props: {}
     };
    }, sessionOptions
 );
 
export default Login;