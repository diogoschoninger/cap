export class ValidationError extends Error {
  validations: any;

  constructor({ message, validations }: any) {
    super(message);
    this.name = this.constructor.name;
    this.validations = validations;
  }
}
