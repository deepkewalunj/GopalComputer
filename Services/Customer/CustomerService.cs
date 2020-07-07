using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using Gopal.Services.User;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Customer
{
    public class CustomerService : ICustomerServices
    {

        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;
        public CustomerService(gopal_dbContext dbContext, IUserServices userServices)
        {
            _dbContext = dbContext;
            _userServices = userServices;
        }

        public DatatableResponseModel GetCustomerList(DatatableRequestModel customerDatatableRequestModel)
        {
            DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel = JsonConvert.SerializeObject(customerDatatableRequestModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                using (var multi = connection.QueryMultiple("usp_GetCustomerList",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data = multi.Read<CustomerModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }


            return datatableResponseModel;
        }

        public CustomerModel AddEditCustomer(CustomerModel customerModel)
        {
            customerModel.userId = _userServices.GetCurrentUserId();
            String strRequestModel = JsonConvert.SerializeObject(customerModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                customerModel.clientId = connection.Query<int>("usp_AddEditCustomer",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
            if (customerModel.clientId > 0)
            {
                TblBill objTblBill = new TblBill();
                objTblBill = _dbContext.TblBill.Where(x => x.IsDeleted != true && x.ClientIdRef == customerModel.clientId && x.IsOpeningBalanceEntry == true).FirstOrDefault();
                if (objTblBill != null)
                {
                    objTblBill.ServiceAmount = customerModel.balanceAmount;
                    objTblBill.OutstandingAmount = customerModel.balanceAmount;
                    objTblBill.ModifiedDate = DateTime.Now;
                    objTblBill.ModifiedBy = customerModel.userId;
                    objTblBill.IsOpeningBalanceEntry = true;
                    _dbContext.Entry(objTblBill).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                }
                else
                {
                    TblBill objTblBillAdd = new TblBill();
                    objTblBillAdd.ServiceAmount = customerModel.balanceAmount;
                    objTblBillAdd.OutstandingAmount = customerModel.balanceAmount;
                    objTblBillAdd.ClientIdRef = customerModel.clientId;
                    objTblBillAdd.CreatedDate = DateTime.Now;
                    objTblBillAdd.CreatedBy = customerModel.userId;
                    objTblBillAdd.IsOpeningBalanceEntry = true;
                    _dbContext.Add(objTblBillAdd);
                    _dbContext.SaveChanges();

                }

            }
            return customerModel;
        }

        public int DeleteCustomer(int customerId)
        {
            TblClient customer = _dbContext.TblClient.FirstOrDefault(x => x.ClientId == customerId);
            if (customer != null)
            {
                customer.IsDeleted = true;
                customer.ModifiedBy = _userServices.GetCurrentUserId();
                customer.ModifiedDate = DateTime.Now;
                customer.ModifiedDate = DateTime.Now;
                _dbContext.SaveChanges();
                return customerId;
            }
            return 0;
        }
    }
}
