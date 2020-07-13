using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Gopal.Models.Bill;
using Gopal.Models.Common;
using Newtonsoft.Json;

namespace Gopal.Services.Bill
{
    public class BillOutwardReportService : IBillOutwardReportService
    {
        public DatatableResponseModel GetBillReportList(BillOutwardReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<BillOutwardReportModel>("usp_GetBillReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }
            return datatableResponseModel;
        }

        public DatatableResponseModel GetOutwardReportList(BillOutwardReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<BillOutwardReportModel>("usp_GetOutwardReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }


            return datatableResponseModel;
        }
    }
}
