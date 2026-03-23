export const isCanceledError = (error: unknown): boolean => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (error instanceof Error && error.message === "canceled") {
    return true;
  }

  if (typeof error === "object" && error !== null) {
    const anyErr = error as any;
    return anyErr.code === "ERR_CANCELED";
  }

  return false;
};
