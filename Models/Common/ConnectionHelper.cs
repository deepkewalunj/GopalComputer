using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Common
{
    public static class ConnectionHelper
   {
        private static string _ConnectionString { get; set; }
       
        public static String GetConnectionString() {
            return _ConnectionString;

        }
        public static void  SetConnectionString(String ConnectionString)
        {
            _ConnectionString= ConnectionString;

        }
    }
}
