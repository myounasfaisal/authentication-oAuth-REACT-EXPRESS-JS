class apiResponse {
    constructor(message = "Success", statusCode, data) {
      this.statusCode = statusCode;
      this.data = data;
      this.success = true;
      this.message = message;
    }
  }
  
  export { apiResponse };