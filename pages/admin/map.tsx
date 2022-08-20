import { NextPage } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import sessionOptions from '../../common/session';
import { useRouter } from 'next/router';

const AdminMap: NextPage = () => {
    const router = useRouter();
    function logout() {
        fetch('/api/admin/login', { method: 'delete' })
            .catch(err => console.log(err))
            .finally(() => {
                router.push('/admin/login');
            });
    }

    return (
        <div>
            <h1>Admin Map Page</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export const getServerSideProps = withIronSessionSsr(
   async function({ req, res }) {
    if (!req.session.loggedIn) {
        res.statusCode = 404;
        res.end();
    }
    return {
        props: {}
    };
   }, sessionOptions
);

export default AdminMap;