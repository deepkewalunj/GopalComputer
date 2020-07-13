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
using Newtonsoft.Json.Linq;
namespace Gopal.Services.Bill
{
    public class BillOutwardReportService : IBillOutwardReportService
    {
        private String GetSearchValue(Object searchModel)
        {
            Type modelType = searchModel.GetType();
            if (modelType == typeof(string))
            {
                return (String)searchModel;
            }
            return ((JObject)searchModel).ToObject<TypeAheadResponseModel>().searchValue;
        }
        public DatatableResponseModel GetBillReportList(BillOutwardReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
              
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
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
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
