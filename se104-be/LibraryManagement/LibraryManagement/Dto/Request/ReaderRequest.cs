using LibraryManagement.Models;
using Microsoft.AspNetCore.Identity;

namespace LibraryManagement.Dto.Request
{
    public class ReaderRequest
    {
        public Guid IdTypeReader { get; set; }
        public string NameReader { get; set; }
        public string Sex { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ReaderUsername { get; set; }
        public string ReaderPassword { get; set; }
        public decimal TotalDebt { get; set; }

    }
}
