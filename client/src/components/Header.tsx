import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

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

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <h1 style={{ margin: 0 }}>Contas a pagar</h1>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/">Página inicial</Link>
            <Link to="/documents/new">Novo documento</Link>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>{user?.name}</span>

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
