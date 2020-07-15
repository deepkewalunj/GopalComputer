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
using Gopal.Models.Report;
using Gopal.Services.Bill;

namespace Gopal.Models.Bill
{
    public class ReportServices : IReportServices
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
        public DatatableResponseModel GetBillReportList(ReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
              
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<ReportModel>("usp_GetBillReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }
            return datatableResponseModel;
        }

        public DatatableResponseModel GetOutwardReportList(ReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<ReportModel>("usp_GetOutwardReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }


            return datatableResponseModel;
        }
        public DatatableResponseModel GetInwardReportList(ReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<ReportModel>("usp_GetInwardReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }


            return datatableResponseModel;
        }
        public DatatableResponseModel GetClientOutstandingReportList(ReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                datatableResponseModel.data = connection.Query<ReportModel>("usp_GetClientOutstandingReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure);
            }


            return datatableResponseModel;
        }
    }
}
