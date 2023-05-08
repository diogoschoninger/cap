import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Header from '../components/Header';
import { getLoggedUser, setLogout } from '../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [documents, setDocuments] = useState<any>([]);

  function listDocuments() {
    if (!user) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setDocuments(res);
      })
      .catch((err) => alert(err.message));
  }

  useEffect(() => {
    listDocuments();
  }, []);

  return (
    <>
      {!user ? (
        <>
          {setLogout()}
          <Navigate to="/login" />
        </>
      ) : null}

      <Header />

      <section>
        <h2>Documentos</h2>

        <div>
          <Link to="/">Novo documento</Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Descrição</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {documents.length < 1 ? (
              <tr>
                <td colSpan={3}>Nenhum documento cadastrado</td>
              </tr>
            ) : (
              documents.map((document: any) => (
                <tr key={document.id}>
                  <td>{document.date}</td>
                  <td>{document.description}</td>
                  <td>{document.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};
