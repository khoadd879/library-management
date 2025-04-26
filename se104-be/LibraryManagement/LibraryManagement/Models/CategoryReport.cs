using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class CategoryReport
    {
        [Key]
        public Guid IdCategoryReport { get; set; }
        public int MonthReport { get; set; }
        public int TotalBorrowCount { get; set; }
    }

}
