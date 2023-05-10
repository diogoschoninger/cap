import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Error from '../../components/Error';
import Header from '../../components/Header';
import { getLoggedUser, setLogout } from '../../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [error, setError] = useState<any>(null);

  const [formDescription, setFormDescription] = useState<any>();
  const [formDate, setFormDate] = useState<any>();
  const [formValue, setFormValue] = useState<any>();
  const [formPayment, setFormPayment] = useState<any>(null);
  const [formSituation, setFormSituation] = useState<any>(null);

  const [payments, setPayments] = useState<any>();
  const [situations, setSituations] = useState<any>();

  function listPayments() {
    if (!user) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setPayments(res);
      })
      .catch((err) => console.error(err));
  }

  function listSituations() {
    if (!user) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/situations`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return setUser(null);

        setSituations(res);
      })
      .catch((err) => console.error(err));
  }

  function registerDocument(event: FormEvent) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        description: formDescription.toUpperCase(),
        value: formValue,
        expiration: formDate,
        user_owner: user.id,
        payment: !formPayment ? 1 : Number(formPayment),
        situation: !formSituation ? 1 : Number(formSituation),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res);
          return;
        }

        alert('Documento cadastrado com sucesso!');
        setError(null);
      })
      .catch((err) => {
        alert('Ocorreu um erro, tente novamente');
        console.error(err);
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

      <Link to="/">Página inicial</Link>

      <form onSubmit={(e) => registerDocument(e)}>
        <div>
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            id="description"
            required
            onChange={(e) => setFormDescription(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="value">Valor</label>
          <input
            type="text"
            id="value"
            required
            onChange={(e) => setFormValue(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="date"
            required
            onChange={(e) => setFormDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="payment">Forma de pagamento</label>
          <select
            id="payment"
            required
            onChange={(e) => setFormPayment(e.target.value)}
          >
            {payments
              ? payments.map((payment: any) => (
                  <option key={payment.id} value={payment.id}>
                    {payment.description}
                  </option>
                ))
              : null}
          </select>
        </div>

        <div>
          <label htmlFor="situation">Situação</label>
          <select
            id="situation"
            required
            onChange={(e) => setFormSituation(e.target.value)}
          >
            {situations
              ? situations.map((situation: any) => (
                  <option key={situation.id} value={situation.id}>
                    {situation.description}
                  </option>
                ))
              : null}
          </select>
        </div>

        {error ? <Error error={error} /> : null}

        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
};
