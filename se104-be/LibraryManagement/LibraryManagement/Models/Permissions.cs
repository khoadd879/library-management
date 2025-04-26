using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Permission
    {
        [Key]
        public string PermissionName { get; set; }
        public string Description { get; set; }
    }

}
