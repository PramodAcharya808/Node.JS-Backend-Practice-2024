class ApiError extends Error {
  constructor(statusCode, message = "Something Went Wrong !") {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
