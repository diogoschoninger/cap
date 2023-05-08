export default (string: string) =>
  Number(Number(string.replace(',', '.')).toFixed(2));
