class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    data = [],
    errors = true,
    success = false,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.success = success;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
