using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Gopal.EntityFrameworkCore;
using Gopal.Models.User;
using Gopal.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Gopal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IConfiguration _config;
        private readonly IUserServices _services;

        public UserController(IUserServices services, IConfiguration config)
        {
            _services = services;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Login(LoginModel login)
        {

            IActionResult response = Unauthorized();
            var user = _services.AuthenticateUser(login);

            if (user != null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private string GenerateJSONWebToken(LoginModel userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            Claim moduleClaim = null;
            var modulePermission = _services.GetUserPermissionsById(userInfo.userId);
            if (modulePermission != null)
            {
                moduleClaim = new Claim("modules", Newtonsoft.Json.JsonConvert.SerializeObject(modulePermission));
            }else
            {
                moduleClaim = new Claim("modules",String.Empty);
            }
            
               
            var claims = new[] {
        new Claim(JwtRegisteredClaimNames.Email, userInfo.userEmail),
        new Claim("userRole", userInfo.userRole.ToString()),
        new Claim("firstName", userInfo.firstName.ToString()),
        new Claim("lastName", userInfo.lastName.ToString()),
        new Claim("userId", userInfo.userId.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        moduleClaim
    };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(720),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("[action]")]
        [Authorize]
        public IActionResult GetUsers()
        {
            return Ok(new { users = _services.GetUsers() });
        }

        [HttpPut("[action]")]
        [Authorize]
        public IActionResult GetUserById(GetUserByIdModel model)
        {
            return Ok(new { user = _services.GetUserById(model.userId), userPermissions= _services.GetUserPermissionsById(model.userId) });
        }

        [HttpPost("[action]")]
        [Authorize]
        public IActionResult SaveUserData(UserDetailsInputModel model)
        {

            return Ok(new { user = _services.SaveUserData(model) });
        }

        [HttpGet]
        [Route("DeleteUser")]
        public ActionResult DeleteUser(int userId)
        {
            return Ok(_services.DeleteUser(userId));
        }

    }
}
