using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Security;

namespace LibraryManagement.Models
{
    public class RolePermission
    {
        [Column("role_name")]
        public string RoleName { get; set; }

        [Column("permission_name")]
        public string PermissionName { get; set; }

        public Role Role { get; set; }
        public Permission Permission { get; set; }
    }

}
