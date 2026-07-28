import { HttpsError, FunctionsErrorCode } from 'firebase-functions/v2/https';

export class BusinessError extends HttpsError {
  constructor(code: string, message: string, details?: unknown) {
    super(code as FunctionsErrorCode, message, details);
  }
}

export const Errors = {
  TOUR_NOT_FOUND: (id: string) => new BusinessError('not-found', 'Tour ' + id + ' not found'),
  BOOKING_NOT_FOUND: (id: string) => new BusinessError('not-found', 'Booking ' + id + ' not found'),
  BOOKING_CONFLICT: () => new BusinessError('already-exists', 'Booking already exists for this date'),
  INSUFFICIENT_QUOTA: () => new BusinessError('resource-exhausted', 'Quota exhausted for this tour'),
  UNAUTHORIZED: () => new BusinessError('unauthenticated', 'Authentication required'),
  FORBIDDEN: (need: string, have: string) => new BusinessError('permission-denied', 'Requires ' + need + ', you have ' + have),
  INVALID_ARGUMENT: (msg: string) => new BusinessError('invalid-argument', msg),
  INTERNAL_ERROR: (msg: string) => new BusinessError('internal', msg),
  SLIDER_NOT_FOUND: (id: string) => new BusinessError('not-found', 'Slide ' + id + ' not found'),
  USER_NOT_FOUND: (id: string) => new BusinessError('not-found', 'User ' + id + ' not found'),
};
