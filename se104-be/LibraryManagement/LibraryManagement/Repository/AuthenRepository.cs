using AutoMapper;
using LibraryManagement.Data;
using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers;
using LibraryManagement.Helpers.Interface;
using LibraryManagement.Models;
using LibraryManagement.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Repository
{
    public class AuthenRepository : IAuthenRepository
    {
        private readonly LibraryManagermentContext _context;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IMapper _mapper;
        private static readonly Guid DefaultTypeReaderId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6");

        public AuthenRepository(LibraryManagermentContext context, ITokenGenerator tokenGenerator,
            IMapper mapper)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
            _mapper = mapper;
        }

        // Hàm đăng nhập
        public async Task<AuthenticationResponse> SignInAsync(AuthenticationRequest request)
        {
            var reader = await _context.Readers.FirstOrDefaultAsync(reader => reader.ReaderUsername == request.username);
            if (reader == null || !BCrypt.Net.BCrypt.Verify(request.password, reader.ReaderPassword))
                throw new Exception("Unauthenticated");
            var token = _tokenGenerator.GenerateToken(reader);
            return token;
        }

        // Hàm đăng ký
        public async Task<ReaderResponse> SignUpAsync(ReaderCreationRequest request)
        {
            var newRole = await _context.Roles.FirstOrDefaultAsync(role => role.RoleName == AppRoles.Reader);

            if (newRole == null) // Nếu role Reader chưa có trong csdl
            {
                newRole = new Role
                {
                    RoleName = AppRoles.Reader,
                    Description = "Reader Role"
                };
                _context.Roles.Add(newRole);
                await _context.SaveChangesAsync();
            }

            var reader = new Reader
            {
                ReaderUsername = request.username,
                ReaderPassword = BCrypt.Net.BCrypt.HashPassword(request.password),
                IdTypeReader = DefaultTypeReaderId,
                RoleName = newRole.RoleName
            };
            _context.Readers.Add(reader);

            await _context.SaveChangesAsync();
            return _mapper.Map<ReaderResponse>(reader);
        }
    }
}
