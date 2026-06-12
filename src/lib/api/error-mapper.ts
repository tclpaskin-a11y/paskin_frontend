/**
 * Utility to convert raw API / network / validation errors into user-friendly statements.
 * Prevents raw stack traces, JSON dumps, SQL errors, etc., from showing in the UI.
 */
export function getReadableErrorMessage(error: any): string {
  if (!error) {
    return "Something went wrong. Please try again later.";
  }

  let message = "";
  let status: number | null = null;

  // 1. Extract error details
  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
    if ("status" in error) {
      status = (error as any).status;
    } else if ("statusCode" in error) {
      status = (error as any).statusCode;
    }
  } else if (typeof error === "object") {
    message = error.message || error.error || error.msg || "";
    status = error.status || error.statusCode || null;
  }

  const lowerMsg = message.toLowerCase();

  // 2. Handle Network / Connection Errors
  if (
    lowerMsg.includes("network error") ||
    lowerMsg.includes("failed to fetch") ||
    lowerMsg.includes("load failed") ||
    lowerMsg.includes("net::err") ||
    lowerMsg.includes("connection refused")
  ) {
    return "Unable to connect. Please check your internet connection.";
  }

  // 3. Map HTTP Status Codes
  if (status !== null) {
    switch (status) {
      case 401:
        return "Please login to continue";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Requested resource was not found.";
      case 422:
        return "Invalid input data. Please verify your entries.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Something went wrong. Please try again later.";
    }
  }

  // 4. Map Common Backend Error Messages
  if (
    lowerMsg.includes("invalid credentials") ||
    lowerMsg.includes("incorrect password") ||
    lowerMsg.includes("wrong password") ||
    lowerMsg.includes("invalid password") ||
    lowerMsg.includes("password you entered is incorrect")
  ) {
    return "Wrong email or password";
  }
  if (
    lowerMsg.includes("unauthorized") ||
    lowerMsg.includes("jwt expired") ||
    lowerMsg.includes("token expired") ||
    lowerMsg.includes("token is invalid") ||
    lowerMsg.includes("please login")
  ) {
    return "Please login to continue";
  }
  if (
    lowerMsg.includes("user not found") ||
    lowerMsg.includes("account not found") ||
    lowerMsg.includes("no user found") ||
    lowerMsg.includes("account does not exist")
  ) {
    return "Account does not exist.";
  }
  if (
    lowerMsg.includes("email already exists") ||
    lowerMsg.includes("email registered") ||
    lowerMsg.includes("account already exists") ||
    lowerMsg.includes("user already exists")
  ) {
    return "An account with this email already exists.";
  }
  if (
    lowerMsg.includes("out of stock") ||
    lowerMsg.includes("currently unavailable") ||
    lowerMsg.includes("product unavailable")
  ) {
    return "This product is currently unavailable.";
  }
  if (
    lowerMsg.includes("payment verification failed") ||
    lowerMsg.includes("signature verification failed") ||
    lowerMsg.includes("verification failed")
  ) {
    return "Payment could not be verified. Please contact support if amount was deducted.";
  }
  if (
    lowerMsg.includes("internal server error") ||
    lowerMsg.includes("something went wrong") ||
    lowerMsg.includes("server error")
  ) {
    return "Something went wrong. Please try again later.";
  }

  // 5. Fallback safety filter
  // Block stack traces, SQL errors, axios internals
  if (
    message &&
    !lowerMsg.includes("sql") &&
    !lowerMsg.includes("database") &&
    !lowerMsg.includes("stack") &&
    !lowerMsg.includes("exception") &&
    !lowerMsg.includes("nullpointer") &&
    !lowerMsg.includes("undefined") &&
    !lowerMsg.includes("axios") &&
    !lowerMsg.includes("http error") &&
    !lowerMsg.includes("json")
  ) {
    return message;
  }

  return "Something went wrong. Please try again later.";
}
