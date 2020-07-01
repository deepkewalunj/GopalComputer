using Dapper;
using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Common
{
    public class TypeAheadService: ITypeAheadService
    {
        public List<TypeAheadResponseModel> GetTypeAheadModelMaterial(TypeAheadRequestModel request)
        {
            List<TypeAheadResponseModel> lstTypeAheadResponseModel = new List<TypeAheadResponseModel>();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {

                lstTypeAheadResponseModel = connection.Query<TypeAheadResponseModel>("usp_GetTypeAheadModelMaterial",
                new { searchText = request.searchText, searchType = request.searchType },
                commandType: CommandType.StoredProcedure)?.ToList();


            }
            return lstTypeAheadResponseModel;
        }

        public List<TypeAheadResponseModel> GetTypeAheadCustomer(TypeAheadRequestModel request)
        {
            List<TypeAheadResponseModel> lstTypeAheadResponseModel = new List<TypeAheadResponseModel>();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {

                lstTypeAheadResponseModel = connection.Query<TypeAheadResponseModel>("usp_GetTypeAheadCustomer",
                new { searchText = request.searchText },
                commandType: CommandType.StoredProcedure)?.ToList();


            }
            return lstTypeAheadResponseModel;
        }

        public List<TypeAheadResponseModel> GetTypeAheadInventory(TypeAheadRequestModel request) {
            List<TypeAheadResponseModel> lstTypeAheadResponseModel = new List<TypeAheadResponseModel>();
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {

                lstTypeAheadResponseModel = connection.Query<TypeAheadResponseModel>("usp_GetTypeAheadAccessories",
                new { searchText = request.searchText },
                commandType: CommandType.StoredProcedure)?.ToList();


            }
            return lstTypeAheadResponseModel;
        }
    }
}
