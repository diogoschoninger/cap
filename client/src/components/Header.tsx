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

      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="/">
            Contas a pagar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <div className="navbar-nav">
              <Link
                to="/documents/new"
                className="nav-link"
                aria-current="page"
              >
                Novo documento
              </Link>
            </div>
            <div className="ms-auto d-flex gap-3 align-items-center">
              <span>{user?.name}</span>

              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setLogout();
                  setUser(null);
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
