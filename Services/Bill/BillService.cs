using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Bill;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.User;
using Microsoft.AspNetCore.Razor.Language.Intermediate;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Bill
{
    public class BillService : IBillServices
    {
        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;

        public BillService(gopal_dbContext dbContext, IUserServices userServices)
        {
            _dbContext = dbContext;
            _userServices = userServices;
        }

        public BillTypeScriptModel AddEditBill(BillTypeScriptModel billModel)
        {
            billModel.billDate = new DateTime(billModel.ngbBillDate.year,
                                         billModel.ngbBillDate.month,
                                         billModel.ngbBillDate.day);


            billModel.chequeDate = new DateTime(billModel.ngbChequeDate.year,
                                         billModel.ngbChequeDate.month,
                                         billModel.ngbChequeDate.day);

            billModel.createdBy = _userServices.GetCurrentUserId();

            if (billModel.billId > 0)
            {
                var bill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.BillId == billModel.billId && x.IsOpeningBalanceEntry != true).FirstOrDefault();
                if (bill != null)
                {
                    bill.AdvanceAmount = (decimal)billModel.advanceAmount;
                    bill.ServiceAmount = (decimal)billModel.serviceAmount;
                    bill.PaidImmediatlyAmount = (decimal)billModel.paidImmediatlyAmount;
                    bill.OutstandingAmount = (decimal)billModel.outstandingAmount;
                    bill.BillDate = billModel.billDate;
                    bill.ChequeDate = billModel.chequeDate;
                    bill.ChequeNo = billModel.chequeNo;
                    bill.ClientIdRef = billModel.lstJobNumbers.FirstOrDefault().clientRefId;
                    bill.CreatedBy = billModel.createdBy;
                    bill.EnggName = billModel.enggName;
                    bill.IsOpeningBalanceEntry = false;
                    bill.MaterialAdded = billModel.materialAdded == "1" ? true : false;
                    bill.MaterialUsed = billModel.materialUsed == "1" ? true : false;
                    bill.PaymentMode = Convert.ToInt32(billModel.paymentMode);
                    bill.PaymentRecievedBy = billModel.paymentRecievedBy;
                    bill.PrintStatus = billModel.printStatus == "1" ? true : false;
                    bill.SmsSent = billModel.smsSent == "1" ? true : false;
                    bill.TestedOk = billModel.testedOk == "1" ? true : false;
                    bill.ModifiedDate = DateTime.Now;
                    _dbContext.Entry(bill).State = EntityState.Modified;
                    _dbContext.SaveChanges();

                    var billInwards = _dbContext.TblBillAndInwardDetail.Where(x => x.BillIdRef == bill.BillId).ToList();
                    _dbContext.RemoveRange(billInwards);
                    _dbContext.SaveChanges();

                    foreach (var item in billModel.lstJobNumbers)
                    {
                        TblBillAndInwardDetail obj = new TblBillAndInwardDetail();
                        obj.BillIdRef = bill.BillId;
                        obj.InwardIdRef = item.searchId;
                        obj.ServiceAmount = Convert.ToDecimal(item.serviceAmount);
                        obj.CreatedBy = billModel.createdBy;
                        obj.CreatedDate = DateTime.Now;
                        _dbContext.TblBillAndInwardDetail.Add(obj);
                        _dbContext.SaveChanges();

                        var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.searchId).FirstOrDefault();
                        if(inward != null)
                        {
                            inward.EstmRepairingAmount = Convert.ToDecimal(item.serviceAmount);
                            inward.ModifiedBy = billModel.createdBy;
                            inward.ModifiedDate = DateTime.Now;
                            inward.OutwardBillStatus = 1;//paid
                            _dbContext.Entry(inward).State = EntityState.Modified;
                            _dbContext.SaveChanges();
                        }
                            
                    }

                }
            }
            else
            {
                TblBill bill = new TblBill();
                bill.AdvanceAmount = (decimal)billModel.advanceAmount;
                bill.ServiceAmount = (decimal)billModel.serviceAmount;
                bill.PaidImmediatlyAmount = (decimal)billModel.paidImmediatlyAmount;
                bill.OutstandingAmount = (decimal)billModel.outstandingAmount;
                bill.BillDate = billModel.billDate;
                bill.ChequeDate = billModel.chequeDate;
                bill.ChequeNo = billModel.chequeNo;
                bill.ClientIdRef = billModel.lstJobNumbers.FirstOrDefault().clientRefId;
                bill.CreatedBy = billModel.createdBy;
                bill.EnggName = billModel.enggName;
                bill.IsOpeningBalanceEntry = false;
                bill.MaterialAdded = billModel.materialAdded == "1" ? true : false;
                bill.MaterialUsed = billModel.materialUsed == "1" ? true : false;
                bill.PaymentMode = Convert.ToInt32(billModel.paymentMode);
                bill.PaymentRecievedBy = billModel.paymentRecievedBy;
                bill.PrintStatus = billModel.printStatus == "1" ? true : false;
                bill.SmsSent = billModel.smsSent == "1" ? true : false;
                bill.TestedOk = billModel.testedOk == "1" ? true : false;
                bill.CreatedDate = DateTime.Now;
                _dbContext.TblBill.Add(bill);
                _dbContext.SaveChanges();

                var billInwards = _dbContext.TblBillAndInwardDetail.Where(x => x.BillIdRef == bill.BillId).ToList();
                _dbContext.RemoveRange(billInwards);
                _dbContext.SaveChanges();

                foreach (var item in billModel.lstJobNumbers)
                {
                    TblBillAndInwardDetail obj = new TblBillAndInwardDetail();
                    obj.BillIdRef = bill.BillId;
                    obj.InwardIdRef = item.searchId;
                    obj.ServiceAmount = Convert.ToDecimal(item.serviceAmount);
                    obj.CreatedBy = billModel.createdBy;
                    obj.CreatedDate = DateTime.Now;
                    _dbContext.TblBillAndInwardDetail.Add(obj);
                    _dbContext.SaveChanges();

                    var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.searchId).FirstOrDefault();
                    if (inward != null)
                    {
                        inward.EstmRepairingAmount = Convert.ToDecimal(item.serviceAmount);
                        inward.ModifiedBy = billModel.createdBy;
                        inward.ModifiedDate = DateTime.Now;
                        inward.OutwardBillStatus = 1;//paid
                        _dbContext.Entry(inward).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                    }
                }
            }


            return billModel;
        }

        public int DeleteBill(int billId)
        {
            TblBill bill = _dbContext.TblBill.FirstOrDefault(x => x.BillId == billId);
            if (bill != null)
            {
                bill.IsDeleted = true;
                bill.ModifiedBy = _userServices.GetCurrentUserId();
                bill.ModifiedDate = DateTime.Now;
                _dbContext.Entry(bill).State = EntityState.Modified;
                _dbContext.SaveChanges();

                var inwardBillList = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && x.BillIdRef == billId).ToList();
                foreach (var item in inwardBillList)
                {
                    var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.InwardIdRef).FirstOrDefault();
                    if (inward != null)
                    {
                        inward.ModifiedBy = _userServices.GetCurrentUserId();
                        inward.ModifiedDate = DateTime.Now;
                        inward.OutwardBillStatus = 2;//Unpaid
                        _dbContext.Entry(inward).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                    }
                }

                var billInwards = _dbContext.TblBillAndInwardDetail.Where(x => x.BillIdRef == billId).ToList();
                _dbContext.RemoveRange(billInwards);
                _dbContext.SaveChanges();

                return billId;
            }
            return 0;
        }

        public bool CheckBillIsGeneratedForJob(int billId, int inwardId)
        {
            if (billId > 0)
            {
                var inward = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && x.InwardIdRef == inwardId).FirstOrDefault();
                if (inward != null)
                {
                    var bill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.BillId == inward.BillIdRef).FirstOrDefault();
                    if (bill != null)
                    {
                        if (bill.BillId != billId)
                        {
                            return true;
                        }
                    }
                }

                var outwordDetail = _dbContext.TblOutwardAndInwardDetail.Where(x => x.IsDeleted != true && x.InwardIdRef == inwardId).FirstOrDefault();
                if (outwordDetail != null)
                {
                    var outwordBill = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.OutwardId == outwordDetail.OutwardIdRef).FirstOrDefault();
                    if (outwordBill != null)
                    {
                        if (outwordBill.OutwardId != billId)
                        {
                            return true;
                        }
                    }
                }
            }
            else
            {
                var inward = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && x.InwardIdRef == inwardId).FirstOrDefault();
                if (inward != null)
                {
                    var bill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.BillId == inward.BillIdRef).FirstOrDefault();
                    if (bill != null)
                    {
                        return true;
                    }
                }
                var outwordDetail = _dbContext.TblOutwardAndInwardDetail.Where(x => x.IsDeleted != true && x.InwardIdRef == inwardId).FirstOrDefault();
                if (outwordDetail != null)
                {
                    var outwordBill = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.OutwardId == outwordDetail.OutwardIdRef).FirstOrDefault();
                    if (outwordBill != null)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public BillTypeScriptModel GetBillById(int billId)
        {
            var bill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.IsOpeningBalanceEntry != true && x.BillId == billId).FirstOrDefault();
            BillTypeScriptModel billTypeScriptModel = new BillTypeScriptModel();
            if (bill != null)
            {
                if (bill.BillDate != null)
                {
                    billTypeScriptModel.ngbBillDate = new NgbDateModel
                    {
                        year = bill.BillDate.Value.Year,
                        month = bill.BillDate.Value.Month,
                        day = bill.BillDate.Value.Day
                    };
                }
                if (bill.ChequeDate != null)
                {
                    billTypeScriptModel.ngbChequeDate = new NgbDateModel
                    {
                        year = bill.ChequeDate.Value.Year,
                        month = bill.ChequeDate.Value.Month,
                        day = bill.ChequeDate.Value.Day
                    };
                }
                billTypeScriptModel.advanceAmount = bill.AdvanceAmount;
                billTypeScriptModel.billDate = bill.BillDate;
                billTypeScriptModel.billId = bill.BillId;
                billTypeScriptModel.chequeDate = bill.ChequeDate;
                billTypeScriptModel.chequeNo = bill.ChequeNo;
                billTypeScriptModel.materialAdded = bill.MaterialAdded == true ? "1" : "2";
                billTypeScriptModel.materialUsed = bill.MaterialUsed == true ? "1" : "2";
                billTypeScriptModel.printStatus = bill.PrintStatus == true ? "1" : "2";
                billTypeScriptModel.smsSent = bill.SmsSent == true ? "1" : "2";
                billTypeScriptModel.testedOk = bill.TestedOk == true ? "1" : "2";
                billTypeScriptModel.outstandingAmount = bill.OutstandingAmount;
                billTypeScriptModel.enggName = bill.EnggName;
                billTypeScriptModel.paidImmediatlyAmount = bill.PaidImmediatlyAmount;
                billTypeScriptModel.paymentMode = bill.PaymentMode.ToString();
                billTypeScriptModel.paymentRecievedBy = bill.PaymentRecievedBy;
                billTypeScriptModel.serviceAmount = bill.ServiceAmount;
            }


            //Process job numbers
            var jobList = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && x.BillIdRef == billTypeScriptModel.billId).ToList();
            if (jobList != null)
            {
                billTypeScriptModel.lstJobNumbers = new List<TypeAheadResponseModel>();
                foreach (var item in jobList)
                {
                    var clientRefId = 0;
                    decimal? advanceAmt = 0;
                    var modelNo = "";
                    var materialType = "";
                    var companyName = "";
                    var serialNo = "";
                    var isRepaired = 2;
                    var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.InwardIdRef).FirstOrDefault();
                    if (inward != null)
                    {
                        clientRefId = (int)inward.ClientRefId;
                        advanceAmt = inward.AdvanceAmount;
                        modelNo = inward.ModelNo;
                        materialType = inward.MaterialType;
                        companyName = inward.CompanyName;
                        serialNo = inward.SerialNo;
                        isRepaired = inward.IsRepaired;
                    }

                    var searchValue = "";
                    if (clientRefId > 0)
                    {
                        searchValue = _dbContext.TblClient.Where(x => x.IsDeleted != true && x.ClientId == clientRefId).FirstOrDefault().CompanyName;
                    }

                    var isRepairedText = "";
                    if(isRepaired == 1)
                    {
                        isRepairedText = "Repaired";
                    }
                    else if (isRepaired == 2)
                    {
                        isRepairedText = "Unrepaired";
                    }
                    else if (isRepaired == 3)
                    {
                        isRepairedText = "Not Repairable";
                    }
                    billTypeScriptModel.lstJobNumbers.Add(new TypeAheadResponseModel
                    {
                        searchId = (int)item.InwardIdRef,
                        searchValue = item.InwardIdRef.ToString() + "   " + searchValue + "     " + isRepairedText,
                        clientRefId = clientRefId,
                        advanceAmount = advanceAmt,
                        modelNo = modelNo,
                        materialType = materialType,
                        companyName = companyName,
                        serialNo = serialNo,
                        isRepaired = isRepaired,
                        serviceAmount = item.ServiceAmount
                    });
                }
            }
            return billTypeScriptModel;
        }

        public DatatableResponseModel GetBillList(DatatableRequestModel getBillModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(getBillModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                using (var multi = connection.QueryMultiple("usp_GetBillList",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data = multi.Read<BillModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }


            return datatableResponseModel;
        }


    }
}
