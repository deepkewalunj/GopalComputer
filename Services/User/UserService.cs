using Gopal.EntityFrameworkCore;
using Gopal.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.User
{
    public class UserService : IUserServices
    {
        
        private readonly gopal_dbContext _dbContext;

        public UserService(gopal_dbContext dbContext)
        {
            _dbContext = dbContext;
            
        }

        public LoginModel AuthenticateUser(LoginModel login)
        {
            LoginModel _loginModel = new LoginModel();
            var user = _dbContext.TblUser.Where(x=>x.IsDeleted != true && x.UserEmail == login.userEmail
                                                          && x.UserPassword== login.userPassword).FirstOrDefault();
            if(user != null)
            {
                _loginModel.lastName = user.LastName;
                _loginModel.firstName = user.FirstName;
                _loginModel.userEmail = user.UserEmail;
                _loginModel.userId = user.UserId;
                _loginModel.userRole = (int)user.UserRole;
                _loginModel.userName = user.UserName;
            }
            return _loginModel;
        }

        public TblUser GetUserById(int userId)
        {
            return _dbContext.TblUser.Where(x => x.IsDeleted != true && x.UserId == userId).FirstOrDefault();
        }

        public object GetUserPermissionsById(int userId)
        {
            return null;
            
        }

        public List<TblUser> GetUsers()
        {
            return _dbContext.TblUser.Where(x => x.IsDeleted != true).ToList();
        }
    }
}
