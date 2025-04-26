using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class TheBook
    {
        [Key]
        public string IdTheBook { get; set; }
        public string IdBook { get; set; }
        public string Status { get; set; }

        public Book Book { get; set; }
    }
}
