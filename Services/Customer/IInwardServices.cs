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
    public interface IInwardServices
    {
        DatatableResponseModel GetInwardList(DatatableRequestModel getInwardModel);
        DatatableResponseModel GetInwardListBYSearchAll(InwardCustomSearch getInwardModel);
        InwardTypeScriptModel AddEditInward(InwardTypeScriptModel inwardModel);
        InwardTypeScriptModel GetInwardById(int inwardId);
        int DeleteInward(int inwardId,ModelStateDictionary modelState);
        List<String> GetAccessories(int inwardId);
        void UpdateBarCodePathByInwardId(int inwardId, string barCodePath);
        string GetCustomerNameByIdForBarcode(int customerId);

    }
}
