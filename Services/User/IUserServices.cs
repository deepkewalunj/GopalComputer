﻿using Gopal.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.User
{
    public interface IUserServices
    {
        LoginModel AuthenticateUser(LoginModel login);
    }
}
