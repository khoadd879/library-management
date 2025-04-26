using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Dto.Request
{
    public class RoleRequest
    {
        public string RoleName { get; set; }
        public string Description { get; set; }
    }
}
