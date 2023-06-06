import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Navigate,
  useParams,
} from 'react-router-dom';

import Error from '../../components/Error';
import Header from '../../components/Header';
import Success from '../../components/Success';
import {
  getLoggedUser,
  setLogout,
} from '../../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));
  const { id } = useParams();

  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);

  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);
  const [loadingSituations, setLoadingSituations] = useState<boolean>(true);
  const [loadingDocument, setLoadingDocument] = useState<boolean>(true);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  const [description, setDescription] = useState<any>();
  const [expiration, setExpiration] = useState<any>();
  const [value, setValue] = useState<any>();
  const [payment, setPayment] = useState<any>(null);
  const [situation, setSituation] = useState<any>(null);

  const [payments, setPayments] = useState<any>();
  const [situations, setSituations] = useState<any>();

  function listPayments() {
    if (!user) return;

    setLoadingPayments(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setPayments(res);
        setLoadingPayments(false);
      })
      .catch((_err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoadingPayments(false);
      });
  }

  function listSituations() {
    if (!user) return;

    setLoadingSituations(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/situations`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setSituations(res);
        setLoadingSituations(false);
      })
      .catch((_err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoadingSituations(false);
      });
  }

  function getDocument() {
    if (!user) return;

    setLoadingDocument(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error && res.error === 'Recurso não encontrado') return window.location.href = '/'

        setDescription(res.description);
        setValue(res.value);
        setExpiration(res.expiration);
        setPayment(res.payment);
        setSituation(res.situation);

        setLoadingDocument(false);
      })
      .catch((_err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoadingDocument(false);
      });
  }

  function editDocument(event: FormEvent) {
    event.preventDefault();

    console.log({ description, value, expiration, payment, situation });

    setError(false);
    setSuccess(null);
    setLoadingEdit(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        description: description.toUpperCase(),
        value: value,
        expiration: expiration,
        payment: !payment ? 1 : payment,
        situation: !situation ? 1 : situation,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res);
          setLoadingEdit(false);
          return;
        }

        setSuccess('Documento editado com sucesso!');
        setLoadingEdit(false);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoadingEdit(false);
      });

    getDocument();
    listPayments();
    listSituations();
  }

  useEffect(() => {
    getDocument();
    listPayments();
    listSituations();
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
      <main
        style={{ width: '100vw', height: '100vh' }}
        className="container mt-3"
      >
        <section className="d-flex flex-column gap-3">
          <h2 className="m-0 text-center">Editar documento</h2>

          <form
            onSubmit={(e) => editDocument(e)}
            className="d-flex flex-column gap-3"
          >
            <div>
              <label htmlFor="description">Descrição</label>
              <input
                className="form-control"
                type="text"
                id="description"
                required
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="d-flex gap-3">
              <div className="col">
                <label htmlFor="value">Valor</label>
                <input
                  className="form-control"
                  type="text"
                  id="value"
                  required
                  defaultValue={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="col">
                <label htmlFor="expiration">Vencimento</label>
                <input
                  className="form-control"
                  type="date"
                  id="expiration"
                  required
                  defaultValue={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                />
              </div>

              <div className="col">
                <label htmlFor="payment">Forma de pagamento</label>
                <select
                  className="form-select"
                  id="payment"
                  required
                  onChange={(e) => setPayment(Number(e.target.value))}
                >
                  {loadingPayments || loadingDocument ? (
                    <option>Carregando...</option>
                  ) : !payments ? (
                    <option> - </option>
                  ) : (
                    payments.map((p: any) => {
                      if (p.id === payment) {
                        return (
                          <option key={p.id} value={p.id} selected>
                            {p.description}
                          </option>
                        );
                      } else {
                        return (
                          <option key={p.id} value={p.id}>
                            {p.description}
                          </option>
                        );
                      }
                    })
                  )}
                </select>
              </div>

              <div className="col">
                <label htmlFor="situation">Situação</label>
                <select
                  id="situation"
                  required
                  onChange={(e) => setSituation(Number(e.target.value))}
                  defaultValue={situation}
                  className="form-select"
                >
                  {loadingSituations || loadingDocument ? (
                    <option>Carregando...</option>
                  ) : !situations ? (
                    <option> - </option>
                  ) : (
                    situations.map((s: any) => {
                      if (s.id === situation) {
                        return (
                          <option key={s.id} value={s.id} selected>
                            {s.description}
                          </option>
                        );
                      } else {
                        return (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        );
                      }
                    })
                  )}
                </select>
              </div>
            </div>

            {error ? <Error error={error} /> : null}

            {success ? <Success message={success} /> : null}

            {loadingPayments || loadingSituations || loadingEdit ? (
              <input
                className="btn btn-primary"
                type="submit"
                value="Carregando..."
                disabled
              />
            ) : error ? (
              <input
                className="btn btn-primary"
                type="submit"
                value="Editar"
                disabled
              />
            ) : (
              <input className="btn btn-primary" type="submit" value="Editar" />
            )}
          </form>
        </section>
      </main>
    </>
  );
};
