import { useEffect, useState } from 'react';
import formatNumberToBRL from '../utils/formatNumberToBRL';

export default function Home() {
  const [documents, setDocuments] = useState([]);

  const getDocuments = () => {
    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((error) => alert(error));
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <>
      <section>
        <h2>Documentos em aberto</h2>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.description}</td>
                <td>{formatNumberToBRL(document.value)}</td>
                <td>{document.expiration}</td>
                <td>
                  <button>Baixar</button>
                  <button>Editar</button>
                  <button>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
