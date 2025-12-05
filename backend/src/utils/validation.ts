import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler';

/**
 * Sanitize user input by removing potentially harmful characters
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/[<>\"'&]/g, (char) => {
    const map: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return map[char] || char;
  });
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate latitude and longitude coordinates
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Validate ride request payload
 */
export const validateRideRequest = (data: any): void => {
  if (!data.pickupLocation || !data.dropoffLocation) {
    throw new ApiError(400, 'Pickup and dropoff locations are required');
  }

  if (!isValidCoordinates(data.pickupLocation.lat, data.pickupLocation.lng)) {
    throw new ApiError(400, 'Invalid pickup coordinates');
  }

  if (!isValidCoordinates(data.dropoffLocation.lat, data.dropoffLocation.lng)) {
    throw new ApiError(400, 'Invalid dropoff coordinates');
  }

  if (data.rideType && !['economy', 'premium', 'xl'].includes(data.rideType)) {
    throw new ApiError(400, 'Invalid ride type');
  }
};

/**
 * Middleware to validate request body
 */
export const validateRequestBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (validationResult.error) {
        const errors = validationResult.error.details.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ApiError(400, `Validation failed: ${JSON.stringify(errors)}`);
      }

      req.body = validationResult.value;
      next();
    } catch (error) {
      next(error);
    }
  };
};
