using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class TypeReader
    {
        [Key]
        public Guid IdTypeReader { get; set; }
        public string NameTypeReader { get; set; }

        public ICollection<Reader> Readers { get; set; }
    }

}
