using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }
        public string? gid { get; set; }
        public string? fname { get; set; }
        public string? gname { get; set; }
        public string? xname { get; set; }
        public string? head { get; set; }
    }
}