using LibraryManagement.Dto.Response;
using LibraryManagement.Models;
using LibraryManagement.Repository;

namespace LibraryManagement.Helpers.Interface
{
    public interface ITokenGenerator
    {
        AuthenticationResponse GenerateToken(Reader reader);
    }
}
