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
using Gopal.EntityFrameworkCore;

namespace Gopal.Models.Bill
{
    public class ReportServices : IReportServices
    {
        private readonly gopal_dbContext _dbContext;
        public ReportServices(gopal_dbContext dbContext)
        {
            _dbContext = dbContext;
           
        }

        private String GetSearchValue(Object searchModel)
        {
            Type modelType = searchModel.GetType();
            if (modelType == typeof(string))
            {
                return (String)searchModel;
            }
            return ((JObject)searchModel).ToObject<TypeAheadResponseModel>().searchValue;
        }

        private void FillInwardAddressAndPhoneNo(ReportViewModel model) {
            var masterData = _dbContext.TblMaster.Where(x => x.MasterKey == "INWARD_ADDRESS" || x.MasterKey == "INWARD_PHONE_NO")?.ToList();
            model.inwardAddressPrint = masterData?.Where(x => x.MasterKey == "INWARD_ADDRESS").FirstOrDefault().MasterValue;
            model.inwardAddressPhoneNoPrint = masterData?.Where(x => x.MasterKey == "INWARD_PHONE_NO").FirstOrDefault().MasterValue;
        }
        public DatatableResponseModel GetBillReportList(ReportSearchModel searchModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            if (searchModel.customerName != null)
            {
                searchModel.customerName = GetSearchValue(searchModel.customerName);
            }
              
            String strRequestModel = JsonConvert.SerializeObject(searchModel);
            ReportViewModel reportViewModel = new ReportViewModel();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                reportViewModel.lstReport = connection.Query<ReportModel>("usp_GetBillReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure)?
                      .ToList();
               
            }
            FillInwardAddressAndPhoneNo(reportViewModel);
            datatableResponseModel.data = reportViewModel;
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
            ReportViewModel reportViewModel = new ReportViewModel();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                reportViewModel.lstReport = connection.Query<ReportModel>("usp_GetOutwardReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure)?
                      .ToList();
            }
            FillInwardAddressAndPhoneNo(reportViewModel);
            datatableResponseModel.data = reportViewModel;
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
            ReportViewModel reportViewModel = new ReportViewModel();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                reportViewModel.lstReport = connection.Query<ReportModel>("usp_GetInwardReportList",
                      new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure)?
                      .ToList();
            }

            FillInwardAddressAndPhoneNo(reportViewModel);
            datatableResponseModel.data = reportViewModel;
            return datatableResponseModel;
        }
        public DatatableResponseModel GetClientOutstandingReportList()
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            ReportViewModel reportViewModel = new ReportViewModel();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                reportViewModel.lstReport = connection.Query<ReportModel>("usp_GetClientOutstandingReportList", 
                    commandType: CommandType.StoredProcedure)?
                    .ToList();
            }

            FillInwardAddressAndPhoneNo(reportViewModel);
            datatableResponseModel.data = reportViewModel;
            return datatableResponseModel;
        }
    }
}
