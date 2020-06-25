using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Customer
{
    public interface ICustomerServices
    {
        DatatableResponseModel GetCustomerList(DatatableRequestModel getCustomerModel);
    }
}
