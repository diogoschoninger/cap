import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import Error from '../components/Error';
import Success from '../components/Success';

export default () => {
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [confirmPassword, setConfirmPassword] = useState<String>('');

  function register(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError({
        error: 'Credenciais inválidas',
        message: 'As senhas não coincidem',
      });

      setLoading(false);
      return;
    }

    if (password.length < 5) {
      setError({
        error: 'Credenciais inválidas',
        message: 'A senha deve conter, no mínimo, 5 caracteres',
      });

      setLoading(false);
      return;
    }

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
          if (res.error === 'SequelizeUniqueConstraintError') {
            setError({
              error: 'Credenciais inválidas',
              message: 'Este email já está sendo utilizado',
            });
          } else {
            setError(res);
          }

          setLoading(false);
          return;
        }

        setSuccess('Usuário criado com sucesso!');
        setLoading(false);
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

        {success ? <Success message={success} /> : null}

        <div>
          {loading ? (
            <input type="submit" value="Carregando..." disabled />
          ) : (
            <input type="submit" value="Cadastrar" />
          )}
        </div>
      </form>

      <Link to="/login">Fazer login</Link>
    </>
  );
};
