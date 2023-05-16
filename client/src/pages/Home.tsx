import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Header from '../components/Header';
import { getLoggedUser, setLogout } from '../services/auth';
import numberToBRL from '../services/numberToBRL';
import Error from '../components/Error';
import formatDate from '../services/formatDate';
import Loading from '../components/Loading';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [error, setError] = useState<any>(null);

  const [totalRegistered, setTotalRegistered] = useState<number>(0);
  const [totalClosed, setTotalClosed] = useState<number>(0);
  const [totalOpen, setTotalOpen] = useState<number>(0);
  const [documents, setDocuments] = useState<any>([]);

  const [totalRegisteredLoading, setTotalRegisteredLoading] =
    useState<boolean>(true);
  const [totalClosedLoading, setTotalClosedLoading] = useState<boolean>(true);
  const [totalOpenLoading, setTotalOpenLoading] = useState<boolean>(true);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);

  async function listTotalRegistered() {
    setError(null);
    setTotalRegisteredLoading(true);

    if (!user) return;

    await fetch(
      `${process.env.REACT_APP_SERVER_URL}/documents/total-registered`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setTotalRegistered(res.total);
        setTotalRegisteredLoading(false);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setTotalRegisteredLoading(false);
      });
  }

  async function listTotalClosed() {
    setError(null);
    setTotalClosedLoading(true);

    if (!user) return;

    await fetch(`${process.env.REACT_APP_SERVER_URL}/documents/total-closed`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setTotalClosed(res.total);
        setTotalClosedLoading(false);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setTotalClosedLoading(false);
      });
  }

  async function listTotalOpen() {
    setError(null);
    setTotalOpenLoading(true);

    if (!user) return;

    await fetch(`${process.env.REACT_APP_SERVER_URL}/documents/total-open`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setTotalOpen(res.total);
        setTotalOpenLoading(false);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setTotalOpenLoading(false);
      });
  }

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
        if (res.error) return setUser(null);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setDocumentsLoading(false);
      });

    listDocuments();
  }

  useEffect(() => {
    listDocuments();
    listTotalRegistered();
    listTotalClosed();
    listTotalOpen();
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

      <main className="container d-flex flex-column gap-3 mt-3">
        <section className="d-flex flex-column gap-3">
          <h2 className="m-0 text-center">Totais</h2>

          <div className="d-flex justify-content-evenly">
            <div className="card col col-lg-3">
              <div className="card-body text-center d-flex flex-column gap-3">
                <h6 className="card-title text-center m-0">Total cadastrado</h6>
                {totalRegisteredLoading ? (
                  <Loading />
                ) : error ? (
                  <>-</>
                ) : (
                  <span>{numberToBRL(totalRegistered)}</span>
                )}
              </div>
            </div>
            <div className="card col col-lg-3">
              <div className="card-body text-center d-flex flex-column gap-3">
                <h6 className="card-title text-center m-0">Total baixado</h6>
                {totalClosedLoading ? (
                  <Loading />
                ) : error ? (
                  <>-</>
                ) : (
                  <span>{numberToBRL(totalClosed)}</span>
                )}
              </div>
            </div>
            <div className="card col col-lg-3">
              <div className="card-body text-center d-flex flex-column gap-3">
                <h6 className="card-title text-center m-0">Total em aberto</h6>
                {totalOpenLoading ? (
                  <Loading />
                ) : error ? (
                  <>-</>
                ) : (
                  <span>{numberToBRL(totalOpen)}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <hr />

        <section className="d-flex flex-column gap-3">
          <h2 className="m-0 text-center">Documentos em aberto</h2>

          <table className="table table-sm table-striped align-middle table-hover">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Pagamento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documentsLoading ? (
                <tr>
                  <td colSpan={5}>
                    <Loading />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5}>
                    <Error error={error} />
                  </td>
                </tr>
              ) : documents.length < 1 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Nenhum documento cadastrado
                  </td>
                </tr>
              ) : (
                documents.map((document: any) => (
                  <tr key={document.id}>
                    <td>{document.description}</td>
                    <td>{numberToBRL(document.value)}</td>
                    <td>{formatDate(document.expiration)}</td>
                    <td>{document.payment}</td>
                    <td>
                      <button
                        onClick={() => closeDocument(document.id)}
                        className="btn btn-success"
                      >
                        Baixar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};
