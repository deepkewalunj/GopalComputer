using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Customer
{
    public interface IInwardServices
    {
        DatatableResponseModel GetInwardList(DatatableRequestModel getInwardModel);
        InwardTypeScriptModel AddEditInward(InwardTypeScriptModel inwardModel);
        InwardTypeScriptModel GetInwardById(int inwardId);
        int DeleteInward(int inwardId);
        List<String> GetAccessories(int inwardId);
        void UpdateBarCodePathByInwardId(int inwardId, string barCodePath);

    }
}
