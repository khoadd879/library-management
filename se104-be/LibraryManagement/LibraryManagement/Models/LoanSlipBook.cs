using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class LoanSlipBook
    {
        [Key]
        public Guid IdLoanSlipBook { get; set; }
        public string IdTheBook { get; set; }
        public Guid IdReader { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public decimal FineAmount { get; set; }

        public Reader Reader { get; set; }
        public TheBook TheBook { get; set; }
    }

}
