import { useEffect } from 'react';

const PrivateRoute = ({ children, session }) => {
    console.log(session?.user)
  useEffect(() => {
      if (session?.user?.accessToken) {
        console.log(session)
        window.location.replace('/');
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return children;
};

export default PrivateRoute;
