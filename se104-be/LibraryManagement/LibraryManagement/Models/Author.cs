using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Author
    {
        [Key]
        public Guid IdOuthor { get; set; }
        public Guid IdTypeBook { get; set; }
        public string NameOuthor { get; set; }
        public string Genre { get; set; }
        public string Nationality { get; set; }
        public string Biography { get; set; }

        public TypeBook TypeBook { get; set; }
    }

}
