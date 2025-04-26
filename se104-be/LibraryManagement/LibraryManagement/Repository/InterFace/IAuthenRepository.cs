using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using Microsoft.AspNetCore.Identity;

namespace LibraryManagement.Repository.IRepository
{
    public interface IAuthenRepository
    {
        // Interface đăng ký
        public Task<ReaderResponse> SignUpAsync(ReaderCreationRequest request);

        // Interface đăng nhập
        public Task<AuthenticationResponse> SignInAsync(AuthenticationRequest request);
    }
}
