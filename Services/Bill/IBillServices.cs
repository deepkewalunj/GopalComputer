using Gopal.Models.Bill;
using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Bill
{
   public interface IBillServices
    {
        DatatableResponseModel GetBillList(DatatableRequestModel getBillModel);
        BillTypeScriptModel AddEditBill(BillTypeScriptModel billModel);
        BillTypeScriptModel GetBillById(int billId);
        int DeleteBill(int billId);
        
        
    }
}
