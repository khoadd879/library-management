using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{

    public class Evaluate
    {
        [Key]
        public Guid IdEvaluate { get; set; }
        public Guid IdReader { get; set; }
        public Guid IdHeaderBook { get; set; }
        public string EvaComment { get; set; }
        public int EvaStar { get; set; }
        public DateTime CreateDate { get; set; }

        public Reader Reader { get; set; }
        public HeaderBook HeaderBook { get; set; }
    }
}
