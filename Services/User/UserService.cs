using Gopal.EntityFrameworkCore;
using Gopal.Models.User;
using Microsoft.EntityFrameworkCore;
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
            return (from per in _dbContext.TblModulePermission
                    join mod in _dbContext.TblModule on per.ModuleIdRef equals mod.ModuleId
                    where per.UserUserIdRef == userId && per.IsDeleted != true && mod.IsDeleted != true
                    select mod
                    ).ToList();
                //_dbContext.TblModulePermission.Where(x => x.IsDeleted != true && x.UserUserIdRef == userId).ToList();


        }

        public List<TblUser> GetUsers()
        {
            return _dbContext.TblUser.Where(x => x.IsDeleted != true).ToList();
        }

        public object SaveUserData(UserDetailsInputModel model)
        {
            var modulePermission = _dbContext.TblModulePermission.Where(x => x.UserUserIdRef == model.user.userId).ToList();
            _dbContext.RemoveRange(modulePermission);
            _dbContext.SaveChanges();
            int userId = 0;
            var user = _dbContext.TblUser.Where(x => x.IsDeleted != true && x.UserId == model.user.userId).FirstOrDefault();
            if(user != null)
            {
                user.FirstName = model.user.firstName;
                user.MiddleName = model.user.middleName;
                user.LastName = model.user.lastName;
                user.UserRole = model.user.userRole;
                user.UserPassword = model.user.userPassword;
                user.UserEmail = model.user.userEmail;
                user.ModifiedBy = 1;
                user.ModifiedDate = DateTime.Now;
                if(user.UserId > 0)
                {
                    _dbContext.Entry(user).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                    userId = user.UserId;
                }
            }
            else
            {
                TblUser obj = new TblUser();
                obj.FirstName = model.user.firstName;
                obj.MiddleName = model.user.middleName;
                obj.LastName = model.user.lastName;
                obj.UserRole = model.user.userRole;
                obj.UserPassword = model.user.userPassword;
                obj.UserEmail = model.user.userEmail;
                obj.CreatedBy = 1;
                obj.CreatedDate = DateTime.Now;
                _dbContext.Add(obj);
                _dbContext.SaveChanges();
                userId = obj.UserId;
            }
            if(userId > 0)
            {
                foreach (var item in model.modulePermission)
                {
                    if (item.isChecked)
                    {
                        TblModulePermission moduleObj = new TblModulePermission();
                        moduleObj.UserUserIdRef = userId;
                        moduleObj.ModuleIdRef = item.moduleId;
                        moduleObj.CreatedDate = DateTime.Now;
                        moduleObj.CreatedBy = 1;
                        _dbContext.Add(moduleObj);
                        _dbContext.SaveChanges();
                    }
                }
            }
            return null;
        }
    }
}
