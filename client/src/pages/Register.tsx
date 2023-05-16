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
      <main
        style={{ width: '100vw', height: '100vh' }}
        className="d-flex justify-content-center align-items-center container"
      >
        <section className="d-flex flex-column gap-3 col-3">
          <h1 className="text-center m-0">Cadastro</h1>

          <form
            onSubmit={(e) => register(e)}
            className="d-flex flex-column gap-3"
          >
            <div className="d-flex flex-column">
              <label htmlFor="name">Nome completo</label>
              <input
                className="p-2 border border-secondary rounded"
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="email">Email</label>
              <input
                className="p-2 border border-secondary rounded"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="password">Senha</label>
              <input
                className="p-2 border border-secondary rounded"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="confirmPassword">Confirme a senha</label>
              <input
                className="p-2 border border-secondary rounded"
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
                <input
                  type="submit"
                  className="btn w-100 btn-primary"
                  value="Carregando..."
                  disabled
                />
              ) : (
                <input
                  type="submit"
                  className="btn w-100 btn-primary"
                  value="Cadastrar"
                />
              )}
            </div>
          </form>

          <Link to="/login">Fazer login</Link>
        </section>
      </main>
    </>
  );
};
