// src/errors.ts

export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  export class ApiError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.name = 'ApiError';
      this.statusCode = statusCode;
    }
  }