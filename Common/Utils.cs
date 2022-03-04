using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;

namespace backend.Common
{
    public static class Utils
    {
        public static bool IsTokenValid(ApplicationDbContext _context, string token)
        {
            var existingUser = _context.User!.SingleOrDefault(u => u.gid == token);

            if (null == existingUser)
            {
                return false;
            }

            return true;
        }
    }
}