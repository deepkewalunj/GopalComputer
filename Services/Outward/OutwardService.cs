using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.Outward;
using Gopal.Services.User;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Outward
{
    public class OutwardService : IOutwardServices
    {
        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;

        public OutwardService(gopal_dbContext dbContext, IUserServices userServices)
        {
            _dbContext = dbContext;
            _userServices = userServices;
        }
        public OutwardTypeScriptModel AddEditOutward(OutwardTypeScriptModel outwardModel)
        {
            outwardModel.outwardDate = new DateTime(outwardModel.ngbOutwardDate.year,
                                         outwardModel.ngbOutwardDate.month,
                                         outwardModel.ngbOutwardDate.day);


            outwardModel.chequeDate = new DateTime(outwardModel.ngbChequeDate.year,
                                         outwardModel.ngbChequeDate.month,
                                         outwardModel.ngbChequeDate.day);

            outwardModel.createdBy = _userServices.GetCurrentUserId();

            if (outwardModel.outwardId > 0)
            {
                var outwardBill = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.OutwardId == outwardModel.outwardId).FirstOrDefault();
                if (outwardBill != null)
                {
                    outwardBill.AdvanceAmount = (decimal)outwardModel.advanceAmount;
                    outwardBill.ServiceAmount = (decimal)outwardModel.serviceAmount;
                    outwardBill.PaidImmediatlyAmount = (decimal)outwardModel.paidImmediatlyAmount;
                    outwardBill.OutstandingAmount = (decimal)outwardModel.outstandingAmount;
                    outwardBill.OutwardDate = outwardModel.outwardDate;
                    outwardBill.ChequeDate = outwardModel.chequeDate;
                    outwardBill.ChequeNo = outwardModel.chequeNo;
                    outwardBill.ClientIdRef = outwardModel.lstJobNumbers.FirstOrDefault().clientRefId;
                    outwardBill.CreatedBy = outwardModel.createdBy;
                    outwardBill.EnggName = outwardModel.enggName;
                    
                    outwardBill.MaterialAdded = outwardModel.materialAdded == "1" ? true : false;
                    outwardBill.MaterialUsed = outwardModel.materialUsed == "1" ? true : false;
                    outwardBill.PaymentMode = Convert.ToInt32(outwardModel.paymentMode);
                    outwardBill.PaymentRecievedBy = outwardModel.paymentRecievedBy;
                    outwardBill.PrintStatus = outwardModel.printStatus == "1" ? true : false;
                    outwardBill.SmsSent = outwardModel.smsSent == "1" ? true : false;
                    outwardBill.TestedOk = outwardModel.testedOk == "1" ? true : false;
                    outwardBill.ModifiedDate = DateTime.Now;
                    _dbContext.Entry(outwardBill).State = EntityState.Modified;
                    _dbContext.SaveChanges();

                    var billOutWardsDetails = _dbContext.TblOutwardAndInwardDetail.Where(x => x.OutwardIdRef == outwardBill.OutwardId).ToList();
                    _dbContext.RemoveRange(billOutWardsDetails);
                    _dbContext.SaveChanges();

                    foreach (var item in outwardModel.lstJobNumbers)
                    {
                        TblOutwardAndInwardDetail obj = new TblOutwardAndInwardDetail();
                        obj.OutwardIdRef = outwardBill.OutwardId;
                        obj.InwardIdRef = item.searchId;
                        obj.ServiceAmount = Convert.ToDecimal(item.serviceAmount);
                        obj.CreatedBy = outwardModel.createdBy;
                        obj.CreatedDate = DateTime.Now;
                        _dbContext.TblOutwardAndInwardDetail.Add(obj);
                        _dbContext.SaveChanges();

                        var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.searchId).FirstOrDefault();
                        if (inward != null)
                        {
                            inward.EstmRepairingAmount = Convert.ToDecimal(item.serviceAmount);
                            inward.ModifiedBy = outwardModel.createdBy;
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
                TblOutward outward = new TblOutward();
                outward.AdvanceAmount = (decimal)outwardModel.advanceAmount;
                outward.ServiceAmount = (decimal)outwardModel.serviceAmount;
                outward.PaidImmediatlyAmount = (decimal)outwardModel.paidImmediatlyAmount;
                outward.OutstandingAmount = (decimal)outwardModel.outstandingAmount;
                outward.OutwardDate = outwardModel.outwardDate;
                outward.ChequeDate = outwardModel.chequeDate;
                outward.ChequeNo = outwardModel.chequeNo;
                outward.ClientIdRef = outwardModel.lstJobNumbers.FirstOrDefault().clientRefId;
                outward.CreatedBy = outwardModel.createdBy;
                outward.EnggName = outwardModel.enggName;
                
                outward.MaterialAdded = outwardModel.materialAdded == "1" ? true : false;
                outward.MaterialUsed = outwardModel.materialUsed == "1" ? true : false;
                outward.PaymentMode = Convert.ToInt32(outwardModel.paymentMode);
                outward.PaymentRecievedBy = outwardModel.paymentRecievedBy;
                outward.PrintStatus = outwardModel.printStatus == "1" ? true : false;
                outward.SmsSent = outwardModel.smsSent == "1" ? true : false;
                outward.TestedOk = outwardModel.testedOk == "1" ? true : false;
                outward.CreatedDate = DateTime.Now;
                _dbContext.TblOutward.Add(outward);
                _dbContext.SaveChanges();

                var billOutwards = _dbContext.TblOutwardAndInwardDetail.Where(x => x.OutwardIdRef == outward.OutwardId).ToList();
                _dbContext.RemoveRange(billOutwards);
                _dbContext.SaveChanges();

                foreach (var item in outwardModel.lstJobNumbers)
                {
                    TblOutwardAndInwardDetail obj = new TblOutwardAndInwardDetail();
                    obj.OutwardIdRef = outward.OutwardId;
                    obj.InwardIdRef = item.searchId;
                    obj.ServiceAmount = Convert.ToDecimal(item.serviceAmount);
                    obj.CreatedBy = outwardModel.createdBy;
                    obj.CreatedDate = DateTime.Now;
                    _dbContext.TblOutwardAndInwardDetail.Add(obj);
                    _dbContext.SaveChanges();

                    var inward = _dbContext.TblInward.Where(x => x.IsDeleted != true && x.InwardId == item.searchId).FirstOrDefault();
                    if (inward != null)
                    {
                        inward.EstmRepairingAmount = Convert.ToDecimal(item.serviceAmount);
                        inward.ModifiedBy = outwardModel.createdBy;
                        inward.ModifiedDate = DateTime.Now;
                        inward.OutwardBillStatus = 1;//paid
                        _dbContext.Entry(inward).State = EntityState.Modified;
                        _dbContext.SaveChanges();
                    }
                }
            }


            return outwardModel;
        }

        public int DeleteOutward(int outwardId)
        {
            TblOutward outward = _dbContext.TblOutward.FirstOrDefault(x => x.OutwardId == outwardId);
            if (outward != null)
            {
                outward.IsDeleted = true;
                outward.ModifiedBy = _userServices.GetCurrentUserId();
                outward.ModifiedDate = DateTime.Now;
                _dbContext.Entry(outward).State = EntityState.Modified;
                _dbContext.SaveChanges();

                var outwardBillList = _dbContext.TblOutwardAndInwardDetail.Where(x => x.IsDeleted != true && x.OutwardIdRef == outwardId).ToList();
                foreach (var item in outwardBillList)
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

                var billOutwards = _dbContext.TblOutwardAndInwardDetail.Where(x => x.OutwardIdRef == outwardId).ToList();
                _dbContext.RemoveRange(billOutwards);
                _dbContext.SaveChanges();

                return outwardId;
            }
            return 0;
        }

        public OutwardTypeScriptModel GetOutwardById(int outwardId)
        {
            var outward = _dbContext.TblOutward.Where(x => x.IsDeleted != true && x.OutwardId == outwardId).FirstOrDefault();
            OutwardTypeScriptModel outwardTypeScriptModel = new OutwardTypeScriptModel();
            if (outward != null)
            {
                if (outward.OutwardDate != null)
                {
                    outwardTypeScriptModel.ngbOutwardDate = new NgbDateModel
                    {
                        year = outward.OutwardDate.Value.Year,
                        month = outward.OutwardDate.Value.Month,
                        day = outward.OutwardDate.Value.Day
                    };
                }
                if (outward.ChequeDate != null)
                {
                    outwardTypeScriptModel.ngbChequeDate = new NgbDateModel
                    {
                        year = outward.ChequeDate.Value.Year,
                        month = outward.ChequeDate.Value.Month,
                        day = outward.ChequeDate.Value.Day
                    };
                }
                outwardTypeScriptModel.advanceAmount = outward.AdvanceAmount;
                outwardTypeScriptModel.outwardDate = outward.OutwardDate;
                outwardTypeScriptModel.outwardId = outward.OutwardId;
                outwardTypeScriptModel.chequeDate = outward.ChequeDate;
                outwardTypeScriptModel.chequeNo = outward.ChequeNo;
                outwardTypeScriptModel.materialAdded = outward.MaterialAdded == true ? "1" : "2";
                outwardTypeScriptModel.materialUsed = outward.MaterialUsed == true ? "1" : "2";
                outwardTypeScriptModel.printStatus = outward.PrintStatus == true ? "1" : "2";
                outwardTypeScriptModel.smsSent = outward.SmsSent == true ? "1" : "2";
                outwardTypeScriptModel.testedOk = outward.TestedOk == true ? "1" : "2";
                outwardTypeScriptModel.outstandingAmount = outward.OutstandingAmount;
                outwardTypeScriptModel.enggName = outward.EnggName;
                outwardTypeScriptModel.paidImmediatlyAmount = outward.PaidImmediatlyAmount;
                outwardTypeScriptModel.paymentMode = outward.PaymentMode.ToString();
                outwardTypeScriptModel.paymentRecievedBy = outward.PaymentRecievedBy;
                outwardTypeScriptModel.serviceAmount = outward.ServiceAmount;
            }


            //Process job numbers
            var jobList = _dbContext.TblOutwardAndInwardDetail.Where(x => x.IsDeleted != true && x.OutwardIdRef == outwardTypeScriptModel.outwardId).ToList();
            if (jobList != null)
            {
                outwardTypeScriptModel.lstJobNumbers = new List<TypeAheadResponseModel>();
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
                    if (isRepaired == 1)
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
                    outwardTypeScriptModel.lstJobNumbers.Add(new TypeAheadResponseModel
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
            return outwardTypeScriptModel;
        }

        public DatatableResponseModel GetOutwardList(DatatableRequestModel getOutwardModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(getOutwardModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                using (var multi = connection.QueryMultiple("usp_GetOutwardList",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data = multi.Read<OutwardModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }


            return datatableResponseModel;
        }
    }
}
