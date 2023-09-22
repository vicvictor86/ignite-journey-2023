export class MaxNumberCheckInsError extends Error {
  constructor() {
    super('Max number check in reached');
  }
}
