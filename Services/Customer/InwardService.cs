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
    public class InwardService : IInwardServices
    {
        
        private readonly gopal_dbContext _dbContext;
        private readonly IUserServices _userServices;
        public InwardService(gopal_dbContext dbContext, IUserServices userServices)
        {
            _dbContext = dbContext;
            _userServices = userServices;
        }

        public DatatableResponseModel GetInwardList(DatatableRequestModel inwardDatatableRequestModel)
        {
           DatatableResponseModel datatableResponseModel = new DatatableResponseModel();
            String strRequestModel= JsonConvert.SerializeObject(inwardDatatableRequestModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
               using (var multi = connection.QueryMultiple("usp_GetInwardList",
                    new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure))
                {
                    datatableResponseModel.recordsTotal = multi.Read<int>().First();
                    datatableResponseModel.data  = multi.Read<InwardModel>()?.ToList();
                    datatableResponseModel.recordsFiltered = datatableResponseModel.recordsTotal;
                }
            }

           
            return datatableResponseModel;
        }

        public InwardModel AddEditInward(InwardModel inwardModel)
        {
            inwardModel.userId= _userServices.GetCurrentUserId();
            String strRequestModel = JsonConvert.SerializeObject(inwardModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                inwardModel.InwardId = connection.Query<int>("usp_AddEditInward",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
            return inwardModel;
        }

        public int DeleteInward(int inwardId) {
           TblInward inward= _dbContext.TblInward.FirstOrDefault(x => x.InwardId == inwardId);
            if (inward != null)
            {
                inward.IsDeleted = true;
                inward.ModifiedBy= _userServices.GetCurrentUserId();
                inward.ModifiedDate = DateTime.Now;
                inward.ModifiedDate = DateTime.Now;
                _dbContext.SaveChanges();
                return inwardId;
            }
            return 0;
        }
    }
}
