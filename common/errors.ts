export class TokenError extends Error {
  constructor(err: string) {
    super(`Token Error: ${err}`);
  }
}

export class APIError extends Error {
  constructor(err: string) {
    super(`API Error: ${err}`);
  }
}

export class FunctionalError extends Error {
  constructor(err: string) {
    super(`Functional Error: ${err}`);
  }
}
