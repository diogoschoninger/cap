import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import Error from '../components/Error';

export default () => {
  const [error, setError] = useState<any>(null);

  const [name, setName] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [confirmPassword, setConfirmPassword] = useState<String>('');

  function register(event: FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) return alert('As senhas não coincidem');

    fetch(`${process.env.REACT_APP_SERVER_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res);
          return;
        }

        return alert('Usuário criado com sucesso!');
      })
      .catch((err) => {
        alert('Ocorreu um erro, tente novamente');
        console.error(err);
      });
  }
  return (
    <>
      <h1>Cadastro</h1>

      <form onSubmit={(e) => register(e)}>
        <div>
          <label htmlFor="name">Nome completo</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirme a senha</label>
          <input
            type="password"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error ? <Error error={error} /> : null}

        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>

      <Link to="/login">Fazer login</Link>
    </>
  );
};
