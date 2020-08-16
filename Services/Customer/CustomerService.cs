using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using Gopal.Services.Common;
using Gopal.Services.User;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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
        private IEmailService _emailService;
        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;
        public CustomerService(gopal_dbContext dbContext, IUserServices userServices, IEmailService emailService)
        {
            _dbContext = dbContext;
            _userServices = userServices;
            _emailService = emailService;
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
        public bool IsCustomerExist(CustomerModel customerModel) {
            return _dbContext.TblClient.Any(client => client.CompanyName == customerModel.companyName 
                                                      && client.ClientId!= customerModel.clientId 
                                                      && client.IsDeleted==false);
        }
        public CustomerModel AddEditCustomer(CustomerModel customerModel,ModelStateDictionary modelState)
        {
            if (IsCustomerExist(customerModel))
            {
                modelState.AddModelError($"{ (int)MODEL_ERRORS.CUSTOMER_ALREADY_EXIST}","Customer company name already exist.");
                return customerModel;
            }
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
            var smsApiKey = _dbContext.TblMaster.Where(x => x.MasterKey == "SMS_API_KEY").FirstOrDefault().MasterValue;
            var SEND_SMS = _dbContext.TblMaster.Where(x => x.MasterKey == "SEND_SMS").FirstOrDefault().MasterValue;
            SMSModel smsModel = new SMSModel();
            smsModel.TemplateName = "WELCOME_V1";
            smsModel.SMS_API_KEY = smsApiKey;
            smsModel.VAR1 = customerModel.companyName;
            if (!string.IsNullOrEmpty(customerModel.mobileNoFirst))
            {
                smsModel.To = customerModel.mobileNoFirst;
            }
            else if (!string.IsNullOrEmpty(customerModel.ownerMobileNo))
            {
                smsModel.To = customerModel.ownerMobileNo;
            }
            if (SEND_SMS == "TRUE" && !string.IsNullOrEmpty(smsModel.To))
            {
                Task.Factory.StartNew(() => { _emailService.SendSMS(smsModel); });
            }
            
            return customerModel;
        }

        public bool IsInwardExist(int customerId) {
            return _dbContext.TblInward.Any(inward => inward.ClientRefId == customerId && inward.IsDeleted==false);
        }

        public int DeleteCustomer(int customerId,ModelStateDictionary modelState)
        {
            if (IsInwardExist(customerId))
            {
                modelState.AddModelError($"{(int)MODEL_ERRORS.CUSTOMER_INWARD_EXIST}","Customer cannot be deleted because inward exist.");
                return customerId;
            }
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
