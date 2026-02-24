/**
 * Extracts a user-friendly error message from an unknown error.
 * Detects access-denied patterns and returns a generic permission message.
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message;
    if (msg.toLowerCase().includes('access denied') || msg.toLowerCase().includes('forbidden')) {
      return "You don't have permission to perform this action";
    }
    return msg;
  }
  return 'An unexpected error occurred';
}

