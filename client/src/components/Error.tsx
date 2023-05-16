export default (props: any) => {
  return (
    <div className="alert alert-danger m-0">
      <strong>{props.error.error}</strong>
      <br />
      <span>{props.error.message}</span>
      <br />

      {props.error.cause instanceof Array ? (
        props.error.cause.map((c: any) => <li>{c.message}</li>)
      ) : (
        <span>{props.error.cause}</span>
      )}
    </div>
  );
};
