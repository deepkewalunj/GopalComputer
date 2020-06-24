using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.User
{
    public class LoginModel
    {
        public int userId { get; set; }
        public string userName { get; set; }
        public string userPassword { get; set; }
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public int userRole { get; set; }
        public string userEmail { get; set; }
        public bool isDeleted { get; set; }
    }
}
