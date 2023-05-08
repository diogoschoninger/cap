import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { getLoggedUser, setLoggedUser } from '../services/auth';

export default () => {
  const [user, setUser] = useState<any>(JSON.parse(getLoggedUser() as string));

  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');

  function login(event: FormEvent) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return alert(JSON.stringify(res));

        setLoggedUser({ token: res.token, ...res.user });
        setUser(res.user);
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
        <div>
          <input type="submit" value="Acessar" />
        </div>
      </form>

      <Link to="/register">Cadastre-se</Link>
    </>
  );
};
