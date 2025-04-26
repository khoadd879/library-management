using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenRepository _authenRepository;

        public AuthenticationController(IAuthenRepository authenRepository)
        {
            _authenRepository = authenRepository;
        }

        // Endpoint đăng ký
        [HttpPost("SignUp")]
        public async Task<ReaderResponse> SignUp(ReaderCreationRequest request)
        {
            return await _authenRepository.SignUpAsync(request);
        }

        // Endpoint đăng nhập
        [HttpPost("SignIn")]   
        public async Task<AuthenticationResponse> SignIn(AuthenticationRequest request)
        {
            return await _authenRepository.SignInAsync(request);
        }
        
    }
}
