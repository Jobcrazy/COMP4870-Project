using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Common
{
    public class Response<T>
    {
        public uint code { get; set; }
        public string? message { get; set; }
        public T? data { get; set; }
    }
}