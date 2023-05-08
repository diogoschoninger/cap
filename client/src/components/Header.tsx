import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getLoggedUser, setLogout } from '../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const verifyLogin = () => {
    if (!user) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/session/verify`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) setUser(null);
      });
  };

  useEffect(() => {
    verifyLogin();
  }, []);

  return (
    <>
      {!user ? (
        <>
          {setLogout()}
          <Navigate to="/login" />
        </>
      ) : null}

      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Contas a pagar</h1>

        <div style={{ display: 'flex' }}>
          <div>
            <li>Nome: {user?.name}</li>
            <li>Email: {user?.email}</li>
          </div>

          <button
            onClick={() => {
              setLogout();
              setUser(null);
            }}
          >
            Sair
          </button>
        </div>
      </header>
    </>
  );
};
