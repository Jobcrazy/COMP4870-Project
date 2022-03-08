using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Common
{
    public enum CODE
    {
        ERROR_SUCCESS,
        ERROR_INVALIDE_TOKEN,
        ERROR_GOAL_EXISTS,
        ERROR_CATEGORY_EXISTS,
        ERROR_INVALID_ID,
    }

    public class Response<T>
    {
        public CODE code { get; set; }
        public string? message { get; set; }
        public T? data { get; set; }
    }
}