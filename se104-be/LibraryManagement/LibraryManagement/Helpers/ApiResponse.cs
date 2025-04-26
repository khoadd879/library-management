namespace LibraryManagement.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public T Data { get; set;  }

        public ApiResponse(bool success, string message, int statusCode, T data = default)
        {
            Success = success;
            Message = message;
            StatusCode = statusCode;
            Data = data;
        }

        public static ApiResponse<T> SuccessResponse(string message, int statusCode, T data)
        {
            return new ApiResponse<T>(true, message, statusCode, data);
        }

        public static ApiResponse<T> FailResponse(string message, int statusCode)
        {
            return new ApiResponse<T>(false, message, statusCode);
        }
    }
}
