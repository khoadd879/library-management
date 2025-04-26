using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{
    public class Image
    {
        [Key]
        public Guid IdImg { get; set; }
        public Guid? IdHeaderBook { get; set; }
        public Guid? IdReader { get; set; }
        public Guid? IdOuthor { get; set; }
        public string Url { get; set; }

        public HeaderBook HeaderBook { get; set; }
        public Reader Reader { get; set; }
        public Author Author { get; set; }
    }

}
