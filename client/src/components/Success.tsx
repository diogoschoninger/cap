export default (props: any) => {
  return (
    <div
      style={{
        border: '1px solid darkgreen',
        padding: '1rem',
        margin: '1rem 0',
      }}
    >
      <span>{props.message}</span>
    </div>
  );
};
