using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Models
{

    public class CreateBook
    {
        public Guid IdHeaderBook { get; set; }
        public Guid IdOuthor { get; set; }

        public HeaderBook HeaderBook { get; set; }
        public Author Author { get; set; }
    }

}
