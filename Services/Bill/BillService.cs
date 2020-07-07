using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Bill;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.User;
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

            billModel.createdBy = _userServices.GetCurrentUserId();
            
            if(billModel.billId > 0)
            {
                var bill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.BillId == billModel.billId && x.IsOpeningBalanceEntry != true).FirstOrDefault();
                if(bill != null)
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
                        obj.CreatedBy = billModel.createdBy;
                        obj.CreatedDate = DateTime.Now;
                        _dbContext.TblBillAndInwardDetail.Add(obj);
                        _dbContext.SaveChanges();
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
                    bill.MaterialAdded = billModel.materialAdded == "1" ? true:false;
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
                        obj.CreatedBy = billModel.createdBy;
                        obj.CreatedDate = DateTime.Now;
                        _dbContext.TblBillAndInwardDetail.Add(obj);
                        _dbContext.SaveChanges();
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
                return billId;
            }
            return 0;
        }

        public BillTypeScriptModel GetBillById(int billId)
        {
            BillTypeScriptModel billTypeScriptModel = new BillTypeScriptModel();
            if (billTypeScriptModel.billDate != null)
            {

                billTypeScriptModel.ngbBillDate = new NgbDateModel
                {
                    year = billTypeScriptModel.billDate.Value.Year,
                    month = billTypeScriptModel.billDate.Value.Month,
                    day = billTypeScriptModel.billDate.Value.Day
                };
            }

            //Process job numbers
            var jobList = _dbContext.TblBillAndInwardDetail.Where(x => x.IsDeleted != true && x.BillIdRef == billTypeScriptModel.billId).ToList();
            if (jobList != null)
            {
                billTypeScriptModel.lstJobNumbers = new List<TypeAheadResponseModel>();
                foreach (var item in jobList)
                {
                    billTypeScriptModel.lstJobNumbers.Add(new TypeAheadResponseModel
                    {
                        searchId = (int)item.InwardIdRef,
                        searchValue = item.InwardIdRef.ToString()
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
