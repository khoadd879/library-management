using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class CategoryReportDetail
    {
        public Guid IdCategoryReport { get; set; }
        public Guid IdTypeBook { get; set; }
        public int BorrowCount { get; set; }
        public float BorrowRatio { get; set; }

        public CategoryReport CategoryReport { get; set; }
        public TypeBook TypeBook { get; set; }
    }

}
