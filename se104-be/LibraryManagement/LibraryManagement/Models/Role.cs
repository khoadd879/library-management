using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Role
    {
        [Key]
        [Column("role_name")]
        public string RoleName { get; set; }

        [Column("description")]
        public string Description { get; set; }
        public ICollection<Reader> Readers { get; set; }

    }

}
