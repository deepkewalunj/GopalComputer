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
using System.Runtime.InteropServices.WindowsRuntime;

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
        private int GetSearchId(Object searchModel)
        {
            Type modelType = searchModel.GetType();
            if (modelType == typeof(int))
            {
                return (int)searchModel;
            }
            return ((JObject)searchModel).ToObject<TypeAheadResponseModel>().searchId;
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

        public AccountStatementModel GetAccountStatementReport(ReportSearchModel searchModel)
        {
            AccountStatementModel obj = new AccountStatementModel();
            var clientId = 0;
            if (searchModel.customerName != null)
            {
                clientId = GetSearchId(searchModel.customerName);
            }
            if(clientId == 0)
            {
                return obj;
            }
            List<TblBill> fullBillList = new List<TblBill>();
            List<TblOutward> fullOutwardList = new List<TblOutward>();
            List<TblLumpsum> fullLumpsumList = new List<TblLumpsum>();
            List<TblBillAndInwardDetail> fullBillInwardList = new List<TblBillAndInwardDetail>();
            List<TblOutwardAndInwardDetail> fullOutwardInwardList = new List<TblOutwardAndInwardDetail>();
           
            fullBillList = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.ClientIdRef == clientId && x.IsOpeningBalanceEntry != true).ToList();
            fullOutwardList = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.ClientIdRef == clientId).ToList();
            fullLumpsumList = _dbContext.TblLumpsum.Where(x => x.IsDeleted != true && x.ClientIdRef == clientId).ToList();

            var billIdArray = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.ClientIdRef == clientId).Select(x=>x.BillId).ToArray();
            fullBillInwardList = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && billIdArray.Contains((int)x.BillIdRef)).ToList();

            var outwardIdArray = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.ClientIdRef == clientId).Select(x => x.OutwardId).ToArray();
            fullOutwardInwardList = _dbContext.TblOutwardAndInwardDetail.Where(x => x.IsDeleted != true && outwardIdArray.Contains((int)x.OutwardIdRef)).ToList();

            

            var client = _dbContext.TblClient.Where(x => x.IsDeleted != true && x.ClientId == clientId).FirstOrDefault();
            if (client != null)
            {
                obj.accountName = client.CompanyName.ToUpper();
                obj.fromDate = searchModel.reportFromDate.day + "/" + searchModel.reportFromDate.month + "/" + searchModel.reportFromDate.year;
                obj.toDate = searchModel.reportToDate.day + "/" + searchModel.reportToDate.month + "/" + searchModel.reportToDate.year;
            }

            obj.billOpeningBalance = 0;
            obj.outwardOpeningBalance = 0;
            obj.leftSideOutstandingAmount = 0;
            obj.rightSideClosingBalance = 0;
            obj.rightSideBottomAmount = 0;

            decimal billOutstandingInnerCount = 0;
            decimal outwardOutstandingInnerCount = 0;

            // calculate bill opening balance before date filter
            decimal oldOpeningBalance = 0;
            var oldOpening = _dbContext.TblBill.Where(x => x.IsOpeningBalanceEntry == true && x.ClientIdRef == clientId && x.IsDeleted != true).FirstOrDefault();
            if (oldOpening != null && oldOpening.OutstandingAmount > 0)
            {
                oldOpeningBalance = oldOpening.OutstandingAmount;
            }

            var billOustandingCount =  fullBillList.Where(x => x.IsDeleted != true && x.IsOpeningBalanceEntry != true
                                          && (x.BillDate.Value.Month < searchModel.reportFromDate.month &&
                                              x.BillDate.Value.Day < searchModel.reportFromDate.day &&
                                              x.BillDate.Value.Year < searchModel.reportFromDate.year)
                                          && x.ClientIdRef == clientId).Sum(x=>x.OutstandingAmount);
            obj.billOpeningBalance = oldOpeningBalance + billOustandingCount;
            //

            // calculate outward opening balance before date filter
            var OutwardOutstandingCount = fullOutwardList.Where(x => x.IsDeleted != true 
                                         && (x.OutwardDate.Value.Month < searchModel.reportFromDate.month &&
                                             x.OutwardDate.Value.Day < searchModel.reportFromDate.day &&
                                             x.OutwardDate.Value.Year < searchModel.reportFromDate.year)
                                         && x.ClientIdRef == clientId).Sum(x => x.OutstandingAmount);
            obj.outwardOpeningBalance = OutwardOutstandingCount;
            //

            // process bill payment details
            var tblBillProcess = fullBillList.Where(x => x.IsDeleted != true
                                                    && (x.BillDate.Value.Month >= searchModel.reportFromDate.month &&
                                                        x.BillDate.Value.Day >= searchModel.reportFromDate.day &&
                                                        x.BillDate.Value.Year >= searchModel.reportFromDate.year)
                                                    && (x.BillDate.Value.Month <= searchModel.reportToDate.month &&
                                                        x.BillDate.Value.Day <= searchModel.reportToDate.day &&
                                                        x.BillDate.Value.Year <= searchModel.reportToDate.year)
                                                        ).ToList();
            if(tblBillProcess != null)
            {
                List<BillPayment> finalBillPaymentList = new List<BillPayment>();
                foreach (var item in tblBillProcess)
                {
                    BillPayment clsBillPayment = new BillPayment();
                    clsBillPayment.advancedAmount = 0;
                    clsBillPayment.serviceAmount = 0;
                    clsBillPayment.paidImmidiateAmount = 0;
                    clsBillPayment.outstandingAmount = 0;
                    if(item.AdvanceAmount > 0)
                    {
                        clsBillPayment.advancedAmount = item.AdvanceAmount;
                    }
                    if (item.ServiceAmount > 0)
                    {
                        clsBillPayment.serviceAmount = item.ServiceAmount;
                    }
                    if (item.PaidImmediatlyAmount > 0)
                    {
                        clsBillPayment.paidImmidiateAmount = item.PaidImmediatlyAmount;
                    }
                    if (item.OutstandingAmount > 0)
                    {
                        clsBillPayment.outstandingAmount = item.OutstandingAmount;
                        billOutstandingInnerCount += item.OutstandingAmount;
                    }
                    clsBillPayment.billDate = item.BillDate;
                    clsBillPayment.billNumber = item.BillId;
                    var jobList = fullBillInwardList.Where(x => x.IsDeleted != true && x.BillIdRef == item.BillId).ToList();
                    var jobCounter = 0;
                    foreach (var jobItem in jobList)
                    {
                        if(jobCounter == 0)
                        {
                            clsBillPayment.jobNumber += jobItem.InwardIdRef.ToString();
                        }
                        else
                        {
                            clsBillPayment.jobNumber += ", ";
                            clsBillPayment.jobNumber += jobItem.InwardIdRef.ToString();
                        }
                    }
                    finalBillPaymentList.Add(clsBillPayment);
                    
                }
                obj.BillPaymentDetails = finalBillPaymentList;
            }
            //

            // process outward payment details
            var tblOutwardProcess = fullOutwardList.Where(x => x.IsDeleted != true
                                                    && (x.OutwardDate.Value.Month >= searchModel.reportFromDate.month &&
                                                        x.OutwardDate.Value.Day >= searchModel.reportFromDate.day &&
                                                        x.OutwardDate.Value.Year >= searchModel.reportFromDate.year)
                                                    && (x.OutwardDate.Value.Month <= searchModel.reportToDate.month &&
                                                        x.OutwardDate.Value.Day <= searchModel.reportToDate.day &&
                                                        x.OutwardDate.Value.Year <= searchModel.reportToDate.year)
                                                        ).ToList();
            if (tblOutwardProcess != null)
            {
                List<BillPayment> finalBillPaymentList = new List<BillPayment>();
                foreach (var item in tblOutwardProcess)
                {
                    BillPayment clsBillPayment = new BillPayment();
                    clsBillPayment.advancedAmount = 0;
                    clsBillPayment.serviceAmount = 0;
                    clsBillPayment.paidImmidiateAmount = 0;
                    clsBillPayment.outstandingAmount = 0;
                    if (item.AdvanceAmount > 0)
                    {
                        clsBillPayment.advancedAmount = item.AdvanceAmount;
                    }
                    if (item.ServiceAmount > 0)
                    {
                        clsBillPayment.serviceAmount = item.ServiceAmount;
                    }
                    if (item.PaidImmediatlyAmount > 0)
                    {
                        clsBillPayment.paidImmidiateAmount = item.PaidImmediatlyAmount;
                    }
                    if (item.OutstandingAmount > 0)
                    {
                        clsBillPayment.outstandingAmount = item.OutstandingAmount;
                        outwardOutstandingInnerCount += item.OutstandingAmount;
                    }
                    clsBillPayment.billDate = item.OutwardDate;
                    clsBillPayment.billNumber = item.OutwardId;
                    var jobList = fullOutwardInwardList.Where(x => x.IsDeleted != true && x.OutwardIdRef == item.OutwardId).ToList();
                    var jobCounter = 0;
                    foreach (var jobItem in jobList)
                    {
                        if (jobCounter == 0)
                        {
                            clsBillPayment.jobNumber += jobItem.InwardIdRef.ToString();
                        }
                        else
                        {
                            clsBillPayment.jobNumber += ", ";
                            clsBillPayment.jobNumber += jobItem.InwardIdRef.ToString();
                        }
                    }
                    finalBillPaymentList.Add(clsBillPayment);
                }
                obj.OutwardPaymentDetails = finalBillPaymentList;
            }
            //

            // process leftside bottom total
            obj.leftSideOutstandingAmount = obj.billOpeningBalance + obj.outwardOpeningBalance + billOutstandingInnerCount + outwardOutstandingInnerCount;
            //

            // process lumpsum payment details
            decimal lumpsumpaidInnerCount = 0;
            var tblLumpsumProcess = fullLumpsumList.Where(x => x.IsDeleted != true
                                                    && (x.LumpsumDate.Value.Month >= searchModel.reportFromDate.month &&
                                                        x.LumpsumDate.Value.Day >= searchModel.reportFromDate.day &&
                                                        x.LumpsumDate.Value.Year >= searchModel.reportFromDate.year)
                                                    && (x.LumpsumDate.Value.Month <= searchModel.reportToDate.month &&
                                                        x.LumpsumDate.Value.Day <= searchModel.reportToDate.day &&
                                                        x.LumpsumDate.Value.Year <= searchModel.reportToDate.year)
                                                        ).ToList();
            if (tblLumpsumProcess != null)
            {
                List<LumpsumPayment> finalLumpsumPaymentList = new List<LumpsumPayment>();
                foreach (var item in tblLumpsumProcess)
                {
                    LumpsumPayment clsBillPayment = new LumpsumPayment();
                    clsBillPayment.paidAmount = 0;
                    if (item.PaidAmount > 0)
                    {
                        clsBillPayment.paidAmount = item.PaidAmount;
                        lumpsumpaidInnerCount += item.PaidAmount;
                    }
                    switch (item.PaymentMode)
                    {
                        case 1:
                            clsBillPayment.paymentMode = "Cash";
                            break;
                        case 2:
                            clsBillPayment.paymentMode = "Cheque";
                            break;
                        case 3:
                            clsBillPayment.paymentMode = "Online Transfer";
                            break;
                        case 4:
                            clsBillPayment.paymentMode = "Google Pay";
                            break;
                        case 5:
                            clsBillPayment.paymentMode = "Phone Pay";
                            break;
                        case 6:
                            clsBillPayment.paymentMode = "Other";
                            break;
                        default:
                            clsBillPayment.paymentMode = "";
                            break;
                    }
                    clsBillPayment.billDate = item.LumpsumDate;
                    finalLumpsumPaymentList.Add(clsBillPayment);
                }
                obj.LumpsumPaymentDetails = finalLumpsumPaymentList;
            }
            //
            obj.rightSideClosingBalance = obj.leftSideOutstandingAmount - lumpsumpaidInnerCount;
            obj.rightSideBottomAmount = obj.leftSideOutstandingAmount;
            obj.addressPrint = _dbContext.TblMaster.Where(x => x.MasterKey == "INWARD_ADDRESS").FirstOrDefault().MasterValue;
            obj.contactPrint = _dbContext.TblMaster.Where(x => x.MasterKey == "INWARD_PHONE_NO").FirstOrDefault().MasterValue;
            return obj;
        }
    }
}
