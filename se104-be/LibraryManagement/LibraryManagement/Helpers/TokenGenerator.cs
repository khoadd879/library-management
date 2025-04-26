using LibraryManagement.Data;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers.Interface;
using LibraryManagement.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryManagement.Helpers
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly IConfiguration _config;
        private readonly LibraryManagermentContext _context;
        public TokenGenerator(IConfiguration config, LibraryManagermentContext context)
        {
            _config = config;
            _context = context;
        }
        public AuthenticationResponse GenerateToken(Reader reader)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, reader.ReaderUsername),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (!string.IsNullOrEmpty(reader.RoleName))
            {
                claims.Add(new Claim(ClaimTypes.Role, reader.RoleName));
            }

            // Khóa để ký Token
            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SecretKey"]));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256)
                );
            return new AuthenticationResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}
