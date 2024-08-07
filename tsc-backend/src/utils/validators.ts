import { ValidationError } from '../errors';
import { Request, Response, NextFunction } from 'express';

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const { destination_id, checkin, checkout, guests, currency, lang, country_code } = req.query;

  const requiredParams = { destination_id, checkin, checkout, guests };
  const missingParams = Object.entries(requiredParams)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingParams.length > 0) {
    throw new ValidationError(`Missing required query parameters: ${missingParams.join(', ')}`);
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(checkin as string) || !dateRegex.test(checkout as string)) {
    throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
  }

  // Validate checkin is before checkout
  const checkinDate = new Date(checkin as string);
  const checkoutDate = new Date(checkout as string);
  if (checkinDate >= checkoutDate) {
    throw new ValidationError('Checkin date must be before checkout date');
  }

  // Validate guests is a positive number
  const guestsNumber = Number(guests);
  if (isNaN(guestsNumber) || guestsNumber <= 0) {
    throw new ValidationError('Guests must be a positive number');
  }

  // Validate optional parameters
  if (currency && typeof currency !== 'string') {
    throw new ValidationError('Currency must be a string');
  }

  if (lang && typeof lang !== 'string') {
    throw new ValidationError('Language must be a string');
  }

  if (country_code && typeof country_code !== 'string') {
    throw new ValidationError('Country code must be a string');
  }

  if (currency !== undefined && typeof currency !== 'string') {
    throw new ValidationError('Currency must be a string');
  }

  const validCurrencies = ['USD', 'EUR', 'GBP', 'SGD']; // Add more as needed

    if (currency && !validCurrencies.includes(currency as string)) {
    throw new ValidationError('Invalid currency');
}

  // If all validations pass, proceed to the next middleware
  next();
};