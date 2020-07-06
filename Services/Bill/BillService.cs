using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Bill;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.User;
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
            return datatableResponseModel;
        }

        
    }
}
