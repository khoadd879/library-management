using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{

    public class HeaderBook
    {
        [Key]
        public Guid IdHeaderBook { get; set; }
        public Guid IdTypeBook { get; set; }
        public string NameHeaderBook { get; set; }
        public string DescribeBook { get; set; }

        public TypeBook TypeBook { get; set; }
    }

}
