class ApiError extends Error {
  constructor(statusCode, message = "Something Went Wrong !") {
    this.statusCode = statusCode;
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
