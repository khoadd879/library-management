using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class BookReceipt
    {
        [Key]
        public Guid IdBookReceipt { get; set; }
        public Guid IdReader { get; set; }
        public DateTime ReceivedDate { get; set; }

        public Reader Reader { get; set; }
    }

}
