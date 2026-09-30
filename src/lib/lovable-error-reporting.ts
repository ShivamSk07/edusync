// EdSync Application Error Reporting

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[EdSync Error Handler]", error, context);
  }
}

// Backwards compatibility
export const reportLovableError = reportAppError;
