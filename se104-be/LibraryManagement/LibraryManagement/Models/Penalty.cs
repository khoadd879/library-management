using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Penalty
    {
        [Key]
        public Guid IdPenalty { get; set; }
        public Guid IdReader { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal AmountCollected { get; set; }
        public decimal AmountRemaining { get; set; }

        public Reader Reader { get; set; }
    }

}
