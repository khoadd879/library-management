using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Book
    {
        [Key]
        public string IdBook { get; set; }
        public Guid IdHeaderBook { get; set; }
        public string Publisher { get; set; }
        public int ReprintYear { get; set; }
        public decimal ValueOfBook { get; set; }

        public HeaderBook HeaderBook { get; set; }
    }

}
