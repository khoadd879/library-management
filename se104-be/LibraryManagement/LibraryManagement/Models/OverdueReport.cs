using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class OverdueReport
    {
        [Key]
        public Guid IdOverdueReport { get; set; }
        public string IdTheBook { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime LateDays { get; set; }

        public TheBook TheBook { get; set; }
    }

}
