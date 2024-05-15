class ApiResoponse {
  constructor(statusCode, message = "SUCCESS", data) {
    this.statusCode = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResoponse };
