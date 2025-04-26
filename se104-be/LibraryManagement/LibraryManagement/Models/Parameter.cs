using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Parameter
    {
        [Key]
        public Guid IdParameter { get; set; }
        public string NameParameter { get; set; }
        public int ValueParameter { get; set; }
    }

}
