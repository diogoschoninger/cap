import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Error from '../components/Error';
import { getLoggedUser, setLoggedUser } from '../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');

  function login(event: FormEvent) {
    event.preventDefault();

    setError(false);
    setLoading(true);

    fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res);
          setLoading(false);
          return;
        }

        setLoggedUser({ token: res.token, ...res.user });
        setUser(res.user);
      })
      .catch((err) => {
        setError({
          error: 'Servidor indisponível',
          message: 'Não foi possível realizar a conexão com o servidor',
        });
        setLoading(false);
      });
  }

  return (
    <>
      {user ? <Navigate to="/" /> : null}

      <h1>Login</h1>

      <form onSubmit={(e) => login(e)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            minLength={5}
            maxLength={255}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? <Error error={error} /> : null}

        <div>
          {loading ? (
            <input type="submit" value="Carregando..." disabled />
          ) : (
            <input type="submit" value="Acessar" />
          )}
        </div>
      </form>

      <Link to="/register">Cadastre-se</Link>
    </>
  );
};
