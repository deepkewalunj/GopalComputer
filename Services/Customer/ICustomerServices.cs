using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Customer
{
    public interface ICustomerServices
    {
        DatatableResponseModel GetCustomerList(DatatableRequestModel getCustomerModel);
        CustomerModel AddEditCustomer(CustomerModel customerModel,ModelStateDictionary modelState);
        int DeleteCustomer(int customerId,ModelStateDictionary modelState);
    }
}
