using AutoMapper;
using LibraryManagement.Data;
using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers;
using LibraryManagement.Models;
using LibraryManagement.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Repository
{
    public class ReaderRepository : IReaderRepository
    {
        private readonly LibraryManagermentContext _context;
        private readonly IMapper _mapper;

        public ReaderRepository(LibraryManagermentContext contex, IMapper mapper)
        {
            _context = contex;
            _mapper = mapper;
        }

        // Hàm thêm độc giả
        public async Task<ApiResponse<ReaderResponse>> addReaderAsync(ReaderRequest request)
        {
            var newReader = _mapper.Map<Reader>(request);
            newReader.ReaderPassword = BCrypt.Net.BCrypt.HashPassword(request.ReaderPassword);
            newReader.RoleName = AppRoles.Reader;
            _context.Readers.Add(newReader);
            await _context.SaveChangesAsync();

            var readerResponse = _mapper.Map<ReaderResponse>(newReader);
            return ApiResponse<ReaderResponse>.SuccessResponse("Thêm độc giả thành công", 201, readerResponse);
        }

        // Hàm lấy danh sách độc giả
        public async Task<List<ReaderResponse>> getAllReaderAsync()
        {
            var listReaders = await _context.Readers.ToListAsync();
            return _mapper.Map<List<ReaderResponse>>(listReaders);
        }

        // Hàm sửa độc giả
        public async Task<ApiResponse<ReaderResponse>> updateReaderAsync(ReaderUpdateRequest request, Guid idReader)
        {
            var updateReader = await _context.Readers.FirstOrDefaultAsync(reader => reader.IdReader == idReader);
            if (updateReader == null)
            {
                return ApiResponse<ReaderResponse>.FailResponse("Không tìm thấy độc giả", 404);
            }
            _mapper.Map(request, updateReader);

            _context.Readers.Update(updateReader);
            await _context.SaveChangesAsync();
            var readerResponse = _mapper.Map<ReaderResponse>(updateReader);
            return ApiResponse<ReaderResponse>.SuccessResponse("Thay đổi thông tin độc giả thành công", 200, readerResponse);
        }

        // Hàm xóa độc giả
        public async Task<ApiResponse<string>> deleteReaderAsync(Guid idReader)
        {
            var deleteReader = await _context.Readers.FirstOrDefaultAsync(reader => reader.IdReader == idReader);
            if (deleteReader == null)
            {
                return ApiResponse<string>.FailResponse("Không tìm thấy độc giả", 404);
            }
            _context.Readers.Remove(deleteReader);
            await _context.SaveChangesAsync();
            return ApiResponse<string>.SuccessResponse("Đã xóa độc giả", 200, "");
        }

    }
}
