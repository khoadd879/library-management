using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class DetailBookReceipt
    {
        public Guid IdBookReceipt { get; set; }
        public string IdBook { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public BookReceipt BookReceipt { get; set; }
        public Book Book { get; set; }
    }

}
