using Gopal.Models.Bill;
using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Bill
{
   public interface IBillOutwardReportService
    {
       DatatableResponseModel GetBillReportList(BillOutwardReportSearchModel searchModel);
       DatatableResponseModel GetOutwardReportList(BillOutwardReportSearchModel searchModel);
    }
}
