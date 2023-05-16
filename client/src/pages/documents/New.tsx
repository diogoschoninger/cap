import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Error from '../../components/Error';
import Header from '../../components/Header';
import { getLoggedUser, setLogout } from '../../services/auth';
import Success from '../../components/Success';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);
  const [loadingSituations, setLoadingSituations] = useState<boolean>(true);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);

  const [formDescription, setFormDescription] = useState<any>();
  const [formExpiration, setFormExpiration] = useState<any>();
  const [formValue, setFormValue] = useState<any>();
  const [formPayment, setFormPayment] = useState<any>(null);
  const [formSituation, setFormSituation] = useState<any>(null);

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

  function registerDocument(event: FormEvent) {
    event.preventDefault();

    setError(false);
    setSuccess(null);
    setLoadingRegister(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        description: formDescription.toUpperCase(),
        value: formValue,
        expiration: formExpiration,
        user_owner: user.id,
        payment: !formPayment ? 1 : Number(formPayment),
        situation: !formSituation ? 1 : Number(formSituation),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res);
          setLoadingRegister(false);
          return;
        }

        setSuccess('Documento criado com sucesso!');
        setLoadingRegister(false);
        setFormDescription('');
        setFormValue('');
        setFormExpiration('');
        setFormPayment('');
        setFormSituation('');
        document.getElementById('description')?.focus();
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoadingRegister(false);
      });
  }

  useEffect(() => {
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
          <h2 className="m-0 text-center">Cadastrar novo documento</h2>

          <form
            onSubmit={(e) => registerDocument(e)}
            className="d-flex flex-column gap-3"
          >
            <div>
              <label htmlFor="description">Descrição</label>
              <input
                className="form-control"
                type="text"
                id="description"
                required
                onChange={(e) => setFormDescription(e.target.value)}
                value={formDescription}
                autoFocus
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
                  onChange={(e) => setFormValue(e.target.value)}
                  value={formValue}
                />
              </div>

              <div className="col">
                <label htmlFor="expiration">Vencimento</label>
                <input
                  className="form-control"
                  type="date"
                  id="expiration"
                  required
                  onChange={(e) => setFormExpiration(e.target.value)}
                  value={formExpiration}
                />
              </div>

              <div className="col">
                <label htmlFor="payment">Forma de pagamento</label>
                <select
                  id="payment"
                  required
                  onChange={(e) => setFormPayment(e.target.value)}
                  defaultValue={formPayment}
                  className="form-select"
                >
                  {loadingPayments ? (
                    <option>Carregando...</option>
                  ) : !payments ? (
                    <option> - </option>
                  ) : (
                    payments.map((payment: any) => (
                      <option key={payment.id} value={payment.id}>
                        {payment.description}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col">
                <label htmlFor="situation">Situação</label>
                <select
                  id="situation"
                  required
                  onChange={(e) => setFormSituation(e.target.value)}
                  defaultValue={formPayment}
                  className="form-select"
                >
                  {loadingSituations ? (
                    <option>Carregando...</option>
                  ) : !situations ? (
                    <option> - </option>
                  ) : (
                    situations.map((situation: any) => (
                      <option key={situation.id} value={situation.id}>
                        {situation.description}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {error ? <Error error={error} /> : null}

            {success ? <Success message={success} /> : null}

            {loadingPayments || loadingSituations || loadingRegister ? (
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
                value="Cadastrar"
                disabled
              />
            ) : (
              <input
                className="btn btn-primary"
                type="submit"
                value="Cadastrar"
              />
            )}
          </form>
        </section>
      </main>
    </>
  );
};
