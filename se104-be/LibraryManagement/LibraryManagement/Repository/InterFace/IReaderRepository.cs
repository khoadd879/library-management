using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers;

namespace LibraryManagement.Repository.IRepository
{
    public interface IReaderRepository
    {
        // Interface thêm độc giả
        public Task<ApiResponse<ReaderResponse>> addReaderAsync(ReaderRequest request);

        // Interface lấy danh sách độc giả
        public Task<List<ReaderResponse>> getAllReaderAsync();

        // Interface sửa độc giả
        public Task<ApiResponse<ReaderResponse>> updateReaderAsync(ReaderUpdateRequest request, Guid idReader);

        // Interface xóa độc giả
        public Task<ApiResponse<string>> deleteReaderAsync(Guid idReader);
    }
}
