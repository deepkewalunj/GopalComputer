using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.Payment;
using Gopal.Services.User;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Gopal.Services.Payment
{
    public class PaymentService : IPaymentServices
    {
        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;

        public PaymentService(gopal_dbContext dbContext, IUserServices userServices)
        {
            _dbContext = dbContext;
            _userServices = userServices;
        }
        public LumpsumTypeScriptModel AddEditLumpsum(LumpsumTypeScriptModel lumpsumModel)
        {
            lumpsumModel.lumpsumDate = new DateTime(lumpsumModel.ngbLumpsumDate.year,
                                         lumpsumModel.ngbLumpsumDate.month,
                                         lumpsumModel.ngbLumpsumDate.day);


            lumpsumModel.chequeDate = new DateTime(lumpsumModel.ngbChequeDate.year,
                                         lumpsumModel.ngbChequeDate.month,
                                         lumpsumModel.ngbChequeDate.day);

            lumpsumModel.createdBy = _userServices.GetCurrentUserId();
            if (lumpsumModel.lumpsumId > 0)
            {
                var lumpsum = _dbContext.TblLumpsum.Where(x => x.IsDeleted != true && x.LumpsumId == lumpsumModel.lumpsumId && x.BillRefId == null && x.OutwardRefId == null).FirstOrDefault();
                if (lumpsum != null)
                {
                    lumpsum.PaidAmount = (decimal)lumpsumModel.paidAmount;
                    lumpsum.LumpsumDate = lumpsumModel.lumpsumDate;
                    lumpsum.ChequeDate = lumpsumModel.chequeDate;
                    lumpsum.ChequeNo = lumpsumModel.chequeNo;
                    lumpsum.ClientIdRef = lumpsumModel.clientRefId;
                    lumpsum.ModifiedBy = lumpsumModel.createdBy;
                    lumpsum.PaymentMode = Convert.ToInt32(lumpsumModel.paymentMode);
                    lumpsum.PaymentRecievedBy = lumpsumModel.paymentRecievedBy;
                    lumpsum.PrintStatus = lumpsumModel.printStatus == "1" ? true : false;
                    lumpsum.SmsSent = lumpsumModel.smsSent == "1" ? true : false;
                    lumpsum.ModifiedDate = DateTime.Now;
                    _dbContext.Entry(lumpsum).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                }
            }
            else
            {
                TblLumpsum lumpsum = new TblLumpsum();
                lumpsum.PaidAmount = (decimal)lumpsumModel.paidAmount;
                lumpsum.LumpsumDate = lumpsumModel.lumpsumDate;
                lumpsum.ChequeDate = lumpsumModel.chequeDate;
                lumpsum.ChequeNo = lumpsumModel.chequeNo;
                lumpsum.ClientIdRef = lumpsumModel.clientRefId;
                lumpsum.CreatedBy = lumpsumModel.createdBy;
                lumpsum.PaymentMode = Convert.ToInt32(lumpsumModel.paymentMode);
                lumpsum.PaymentRecievedBy = lumpsumModel.paymentRecievedBy;
                lumpsum.PrintStatus = lumpsumModel.printStatus == "1" ? true : false;
                lumpsum.SmsSent = lumpsumModel.smsSent == "1" ? true : false;
                lumpsum.CreatedDate = DateTime.Now;
                _dbContext.TblLumpsum.Add(lumpsum);
                _dbContext.SaveChanges();
            }
            return lumpsumModel;
        }

        public int DeleteLumpsum(int lumpsumId)
        {
            TblLumpsum lumpsum = _dbContext.TblLumpsum.FirstOrDefault(x => x.LumpsumId == lumpsumId);
            if (lumpsum != null)
            {
                lumpsum.IsDeleted = true;
                lumpsum.ModifiedBy = _userServices.GetCurrentUserId();
                lumpsum.ModifiedDate = DateTime.Now;
                _dbContext.Entry(lumpsum).State = EntityState.Modified;
                _dbContext.SaveChanges();
                return lumpsumId;
            }
            return 0;
        }

        public LumpsumTypeScriptModel GetLumpsumById(int lumpsumId)
        {
            var lumpsum = _dbContext.TblLumpsum.Where(x => x.IsDeleted != true && x.LumpsumId == lumpsumId && x.BillRefId == null && x.OutwardRefId == null).FirstOrDefault();
            LumpsumTypeScriptModel lumpsumTypeScriptModel = new LumpsumTypeScriptModel();
            var masterDate = _dbContext.TblMaster.ToList();
            lumpsumTypeScriptModel.normalPrinterName = masterDate.Where(x => x.MasterKey == "NORMAL_PRINTER").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.bankAccountNoPrint = masterDate.Where(x => x.MasterKey == "BANK_ACCOUNT").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.bankNamePrint = masterDate.Where(x => x.MasterKey == "BANK_NAME").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.ifscCodePrint = masterDate.Where(x => x.MasterKey == "IFSC_CODE").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.gPayPrint = masterDate.Where(x => x.MasterKey == "GPAY").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.inwardAddressPrint = masterDate.Where(x => x.MasterKey == "INWARD_ADDRESS").FirstOrDefault().MasterValue;
            lumpsumTypeScriptModel.inwardAddressPhoneNoPrint = masterDate.Where(x => x.MasterKey == "INWARD_PHONE_NO").FirstOrDefault().MasterValue;
            if (lumpsum != null)
            {
                if (lumpsum.LumpsumDate != null)
                {
                    lumpsumTypeScriptModel.ngbLumpsumDate = new NgbDateModel
                    {
                        year = lumpsum.LumpsumDate.Value.Year,
                        month = lumpsum.LumpsumDate.Value.Month,
                        day = lumpsum.LumpsumDate.Value.Day
                    };
                }
                if (lumpsum.ChequeDate != null)
                {
                    lumpsumTypeScriptModel.ngbChequeDate = new NgbDateModel
                    {
                        year = lumpsum.ChequeDate.Value.Year,
                        month = lumpsum.ChequeDate.Value.Month,
                        day = lumpsum.ChequeDate.Value.Day
                    };
                }
                lumpsumTypeScriptModel.paidAmount = lumpsum.PaidAmount;
                lumpsumTypeScriptModel.lumpsumDate = lumpsum.LumpsumDate;
                lumpsumTypeScriptModel.lumpsumId = lumpsum.LumpsumId;
                lumpsumTypeScriptModel.chequeDate = lumpsum.ChequeDate;
                lumpsumTypeScriptModel.chequeNo = lumpsum.ChequeNo;
                lumpsumTypeScriptModel.printStatus = lumpsum.PrintStatus == true ? "1" : "2";
                lumpsumTypeScriptModel.smsSent = lumpsum.SmsSent == true ? "1" : "2";
                lumpsumTypeScriptModel.paymentMode = lumpsum.PaymentMode.ToString();
                lumpsumTypeScriptModel.paymentRecievedBy = lumpsum.PaymentRecievedBy;
                lumpsumTypeScriptModel.paidAmount = lumpsum.PaidAmount;
                lumpsumTypeScriptModel.clientRefId = lumpsum.ClientIdRef;
            }



            
            if (lumpsumTypeScriptModel.clientRefId > 0)
            {
                statementAmounts cls = new statementAmounts();
                cls = getStatementAmount((int)lumpsumTypeScriptModel.clientRefId);
                if(cls != null)
                {
                    lumpsumTypeScriptModel.customerName = cls.customerName;
                    lumpsumTypeScriptModel.totalBillAmount = cls.totalBillAmount;
                    lumpsumTypeScriptModel.totalOutwordAmount = cls.totalOutwordAmount;
                    lumpsumTypeScriptModel.totalAmountDue = cls.totalAmountDue;
                    lumpsumTypeScriptModel.totalPaidAmount = cls.totalPaidAmount;
                    lumpsumTypeScriptModel.outstandingAmount = cls.outstandingAmount;
                }
            }
            return lumpsumTypeScriptModel;
        }

        public DatatableResponseModel GetLumpsumList(DatatableRequestModel getLumpsumModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(getLumpsumModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                using (var multi = connection.QueryMultiple("usp_GetLumpsumList",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data = multi.Read<LumpsumModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }


            return datatableResponseModel;
        }

        public statementAmounts getStatementAmount(int clientRefId)
        {
            var mainBill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId).ToList();
            var mainOutward = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId).ToList();
            statementAmounts responceStatement = new statementAmounts();
            responceStatement.outstandingAmount = 0;
            responceStatement.totalAmountDue = 0;
            responceStatement.totalBillAmount = 0;
            responceStatement.totalOutwordAmount = 0;
            responceStatement.totalPaidAmount = 0;
            var bill = mainBill.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId && x.IsOpeningBalanceEntry != true).ToList();
            if(bill != null)
            {
                foreach (var item in bill)
                {
                    if(item.ServiceAmount > 0)
                    {
                        responceStatement.totalBillAmount += item.ServiceAmount;
                    }
                    if (item.PaidImmediatlyAmount > 0)
                    {
                        responceStatement.totalPaidAmount += item.PaidImmediatlyAmount;
                    }
                    if (item.AdvanceAmount > 0)
                    {
                        responceStatement.totalPaidAmount += item.AdvanceAmount;
                    }
                }
                var isOpeningBalance = mainBill.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId && x.IsOpeningBalanceEntry == true).FirstOrDefault();
                if (isOpeningBalance != null && isOpeningBalance.OutstandingAmount > 0)
                {
                    responceStatement.totalBillAmount += isOpeningBalance.OutstandingAmount;
                }
                
            }
            var outward = mainOutward.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId).ToList();
            if (outward != null)
            {
                foreach (var item in outward)
                {
                    if (item.ServiceAmount > 0)
                    {
                        responceStatement.totalOutwordAmount += item.ServiceAmount;
                    }
                    if (item.PaidImmediatlyAmount > 0)
                    {
                        responceStatement.totalPaidAmount += item.PaidImmediatlyAmount;
                    }
                    if (item.AdvanceAmount > 0)
                    {
                        responceStatement.totalPaidAmount += item.AdvanceAmount;
                    }
                }

            }
            var lumpsumList = _dbContext.TblLumpsum.Where(x => x.IsDeleted != true && x.ClientIdRef == clientRefId).ToList();
            if (lumpsumList != null)
            {
                foreach (var item in lumpsumList)
                {
                    if (item.PaidAmount > 0)
                    {
                        responceStatement.totalPaidAmount += item.PaidAmount;
                    }
                }

            }

            responceStatement.totalAmountDue = responceStatement.totalBillAmount + responceStatement.totalOutwordAmount;
            responceStatement.outstandingAmount = responceStatement.totalAmountDue - responceStatement.totalPaidAmount;
            var client = _dbContext.TblClient.Where(x => x.IsDeleted != true && x.ClientId == clientRefId).FirstOrDefault();
            if(client != null)
            {
                responceStatement.customerName = client.CompanyName + "           " + client.ClientName; 
            }
            
            return responceStatement;
        }
    }
}

