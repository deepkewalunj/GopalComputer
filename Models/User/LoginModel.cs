using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
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

    public class GetUserByIdModel
    {
        public int userId { get; set; }
    }

    public class UserDetailsInputModel
    {
        public UserModel user { get; set; }
        public List<UserPermission> modulePermission { get; set; }
    }

    public class UserModel
    {
        public int? userId { get; set; }
        public string userPassword { get; set; }
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public int? userRole { get; set; }
        public string userEmail { get; set; }
    }
    public class UserPermission
    {
        public int moduleId { get; set; }
        public string moduleName { get; set; }
        public bool isChecked { get; set; }
       
    }
}
