using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Common
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
        string GetCAEmailAddress();
        string GetClientEmailAddressById(int clientId);
    }
}
