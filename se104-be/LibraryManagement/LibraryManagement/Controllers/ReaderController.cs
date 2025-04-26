using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers;
using LibraryManagement.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
    [Route("api/reader/[controller]")]
    [ApiController]
    public class ReaderController : ControllerBase
    {
        private IReaderRepository _readerRepository;

        public ReaderController(IReaderRepository readerRepository)
        {
            _readerRepository = readerRepository;
        }

        // Endpoint lấy danh sách độc giả
        [Authorize(Roles = "Reader")]
        [HttpGet("list_reader")]
        public async Task<IActionResult> gettAllReader()
        {
            try
            {
                return Ok(await _readerRepository.getAllReaderAsync());
            }
            catch
            {
                return BadRequest();
            }
        }

        // Endpoint thêm độc giả
        [HttpPost("add_reader")]
        public async Task<ApiResponse<ReaderResponse>> addNewReader(ReaderRequest request)
        {
            return await _readerRepository.addReaderAsync(request);
        }

        // Endpont sửa độc giả
        [HttpPut("update_reader/{idReader}")]
        public async Task<ApiResponse<ReaderResponse>> updateReader(ReaderUpdateRequest request, Guid idReader)
        {
            return await _readerRepository.updateReaderAsync(request, idReader);
        }

        // Endpoint xóa độc giả
        [HttpDelete("delete_reader/{idReader}")]
        public async Task<ApiResponse<string>> deleteReader(Guid idReader)
        {
            return await _readerRepository.deleteReaderAsync(idReader);
        }
    }
}
