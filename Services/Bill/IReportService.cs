using Gopal.Models.Bill;
using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Report;
namespace Gopal.Services.Bill
{
    public interface IReportServices
    {
        DatatableResponseModel GetBillReportList(ReportSearchModel searchModel);
        DatatableResponseModel GetOutwardReportList(ReportSearchModel searchModel);

        DatatableResponseModel GetInwardReportList(ReportSearchModel searchModel);


        AccountStatementModel GetAccountStatementReport(ReportSearchModel searchModel);
        AccountStatementModel GetAccountStatementReportPDF(int id, int fd, int fm, int fy, int td, int tm, int ty);
        DatatableResponseModel GetClientOutstandingReportList();

        void SendOustandingSMS(List<ClientOutstandingSMSModel> model);
        

    }
}
