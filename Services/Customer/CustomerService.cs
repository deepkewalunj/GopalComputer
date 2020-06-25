using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
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
        
        private readonly GopalDbContext _dbContext;

        public CustomerService(GopalDbContext dbContext)
        {
            _dbContext = dbContext;
            
        }

        public DatatableResponseModel GetCustomerList(DatatableRequestModel customerDatatableRequestModel)
        {
           DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel= JsonConvert.SerializeObject(customerDatatableRequestModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
               using (var multi = connection.QueryMultiple("usp_GetCustomerList",
                    new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data  = multi.Read<CustomerListModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }

           
            return datatableResponseModel;
        }
    }
}
