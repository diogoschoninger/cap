export class ValidationError extends Error {
  validations: any;

  constructor({ message, validations }: any) {
    super(message);
    this.name = this.constructor.name;
    this.validations = validations;
  }
}

export class AuthenticationError extends Error {
  cause: string;

  constructor(cause = 'Não especificada') {
    super('O usuário não pode ser autenticado');
    this.name = this.constructor.name;
    this.cause = cause;
  }
}
