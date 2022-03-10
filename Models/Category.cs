using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Category
    {
        [Key]
        public int id { get; set; }
        public int uid { get; set; }

        [Required]
        public string? categoryName { get; set; }

        [ForeignKey("uid")]
        public User? user { get; set; }
    }
}
