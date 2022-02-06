using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace backend.Models
{
    public class Goal
    {
        [Key]
        public int id { get; set; }

        public int uid { get; set; }

        public double amount { get; set; }

        public DateTime date { get; set; }

        [ForeignKey("uid")]
        public User? user { get; set; }
    }
}