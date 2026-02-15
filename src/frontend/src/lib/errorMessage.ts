// Helper to extract human-readable error messages from thrown errors
export function extractErrorMessage(error: unknown): string {
  if (!error) return '';
  
  // If it's a string, return it
  if (typeof error === 'string') return error;
  
  // If it's an Error object
  if (error instanceof Error) {
    // Check for agent errors with nested messages
    if ('message' in error && error.message) {
      // Try to extract the actual error from IC agent errors
      const message = error.message;
      
      // Look for "Reject text:" pattern (common in IC errors)
      const rejectMatch = message.match(/Reject text:\s*(.+?)(?:\n|$)/);
      if (rejectMatch) return rejectMatch[1].trim();
      
      // Look for "trapped explicitly:" pattern
      const trapMatch = message.match(/trapped explicitly:\s*(.+?)(?:\n|$)/);
      if (trapMatch) return trapMatch[1].trim();
      
      // Return the full message if no pattern matched
      return message;
    }
  }
  
  // If it's an object with a message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  
  // Fallback: stringify the error
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
