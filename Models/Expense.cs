using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Expense
    {
        [Key]
        public int id { get; set; }

        public int uid { get; set; }

        public int category { get; set; }

        public double amount { get; set; }

        public string? note { get; set; }

        public DateTime date { get; set; }

        [ForeignKey("uid")]
        public User? user { get; set; }
    }
}