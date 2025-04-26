using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Dto.Request
{
    public class AuthenticationRequest
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string password { get; set; }
    }
}
