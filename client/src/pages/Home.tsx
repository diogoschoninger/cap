import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Header from '../components/Header';
import { getLoggedUser, setLogout } from '../services/auth';
import numberToBRL from '../services/numberToBRL';
import Error from '../components/Error';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [error, setError] = useState<any>(null);

  const [documents, setDocuments] = useState<any>([]);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);

  async function listDocuments() {
    setError(null);
    setDocumentsLoading(true);

    if (!user) return;

    await fetch(`${process.env.REACT_APP_SERVER_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setDocuments(res);
        setDocumentsLoading(false);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setDocumentsLoading(false);
      });
  }

  async function closeDocument(id: number) {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/documents/close/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
          return setUser(null);
        }
      })
      .catch((err) => {
        setUser(null);
      });

    listDocuments();
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

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documentsLoading ? (
              <tr>
                <td colSpan={4}>Carregando documentos...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4}>
                  <Error error={error} />
                </td>
              </tr>
            ) : documents.length < 1 ? (
              <tr>
                <td colSpan={4}>Nenhum documento cadastrado</td>
              </tr>
            ) : (
              documents.map((document: any) => (
                <tr key={document.id}>
                  <td>{document.description}</td>
                  <td>{numberToBRL(document.value)}</td>
                  <td>{document.expiration}</td>
                  <td>
                    <button onClick={() => closeDocument(document.id)}>
                      Baixar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};
