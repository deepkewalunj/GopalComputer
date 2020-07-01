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

        public InwardTypeScriptModel AddEditInward(InwardTypeScriptModel inwardTypeSriptModel)
        {
            InwardModel inwardModel = PreProcessInward(inwardTypeSriptModel);

            inwardModel.userId= _userServices.GetCurrentUserId();
            String strRequestModel = JsonConvert.SerializeObject(inwardModel);
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                inwardModel.InwardId = connection.Query<int>("usp_AddEditInward",
                     new { RequestModel = strRequestModel }, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
            

            return inwardTypeSriptModel;
        }

        private bool IsMaterialExist(string modelNo, string materialType, string companyName)
        {

            string sql = @"SELECT  COUNT(searchId) FROM TblSearchModelNoMaterialTypeCompanyName
                            WHERE modelno=@modelNo and materialType=@materialType and companyName=@companyName;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                return connection.QueryFirst<int>(sql, new {modelNo, materialType,companyName })>0;

               
            }
        }

        private bool IsAccessoriesExist(string materialType, string accessories)
        {
            string sql = @"SELECT  COUNT(materialAccessoryId) FROM TblMaterialAccessory
                            WHERE  materialType=@materialType and AccessoryName=@accessories;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                return connection.QueryFirst<int>(sql, new { materialType, accessories }) > 0;

            }
            
        }

        private int InsertintoTblSearchMaterialType(string modelNo, string materialType, string companyName) {
            TblSearchModelNoMaterialTypeCompanyName tblSearchModelNoMaterialTypeCompanyName 
                = new TblSearchModelNoMaterialTypeCompanyName();
            tblSearchModelNoMaterialTypeCompanyName.ModelNo = modelNo;
            tblSearchModelNoMaterialTypeCompanyName.MaterialType = materialType;
            tblSearchModelNoMaterialTypeCompanyName.CompanyName = companyName;
            tblSearchModelNoMaterialTypeCompanyName.CreatedBy= _userServices.GetCurrentUserId();
            tblSearchModelNoMaterialTypeCompanyName.CreatedDate = DateTime.Now;
            _dbContext.TblSearchModelNoMaterialTypeCompanyName.Add(tblSearchModelNoMaterialTypeCompanyName);
            _dbContext.SaveChanges();
            return tblSearchModelNoMaterialTypeCompanyName.SearchId;
        }

        private int InsertintoTblMaterialAccessories(string materialType,string accessories) {
            TblMaterialAccessory tblMaterialAccessory = new TblMaterialAccessory();
            tblMaterialAccessory.AccessoryName = accessories;
            tblMaterialAccessory.MaterialType = materialType;
            tblMaterialAccessory.CreatedBy= _userServices.GetCurrentUserId(); ;
            tblMaterialAccessory.CreatedDate = DateTime.Now;
            _dbContext.TblMaterialAccessory.Add(tblMaterialAccessory);
            _dbContext.SaveChanges();
            return tblMaterialAccessory.MaterialAccessoryId;
        }

        private InwardModel PreProcessInward(InwardTypeScriptModel inwardModel)
        {
            //Process Inward Date
            inwardModel.InwardDate = new DateTime(inwardModel.NgbInwardDate.year, 
                                         inwardModel.NgbInwardDate.month, 
                                         inwardModel.NgbInwardDate.day);

            //Process Customer Information
            inwardModel.clientRefId = inwardModel.CustomerTypeAhead.searchId;

            //Search Inward Details
            bool isMaterialExist = IsMaterialExist(inwardModel.ModelNoTypeAhead.searchValue,
                inwardModel.MaterialTypeAhead.searchValue, inwardModel.CompanyNameTypeAhead.searchValue);
            if (!isMaterialExist)
            {
                //Insert it for Search
                InsertintoTblSearchMaterialType(inwardModel.ModelNoTypeAhead.searchValue,
                inwardModel.MaterialTypeAhead.searchValue, inwardModel.CompanyNameTypeAhead.searchValue);
            }

            inwardModel.ModelNo = inwardModel.ModelNoTypeAhead.searchValue;
            inwardModel.MaterialType = inwardModel.MaterialTypeAhead.searchValue;
            inwardModel.CompanyName = inwardModel.CompanyNameTypeAhead.searchValue;


            //Process Delivery Date
            inwardModel.DeliveryDate = new DateTime(inwardModel.NgbDeliveryDate.year,
                                        inwardModel.NgbDeliveryDate.month,
                                        inwardModel.NgbDeliveryDate.day);

            //Process Accessories
            
            if (inwardModel.lstAccessories != null && inwardModel.lstAccessories.Count > 0)
            {
                List<String> lstAccessories = new List<String>();
                inwardModel.lstAccessories.ForEach(accesory =>
                {
                    if (!IsAccessoriesExist(inwardModel.MaterialTypeAhead.searchValue, accesory.searchValue))
                    {
                        InsertintoTblMaterialAccessories(inwardModel.MaterialTypeAhead.searchValue, accesory.searchValue);
                    }
                    lstAccessories.Add(accesory.searchValue);
                });
                inwardModel.Accessories = String.Join('|', lstAccessories);
            }
           



            return inwardModel;
        }

        public InwardTypeScriptModel GetInwardById(int inwardId ) {
            InwardTypeScriptModel inwardTypeScriptModel = new InwardTypeScriptModel();  
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                inwardTypeScriptModel = connection.Query<InwardTypeScriptModel>("usp_GetInwardById",
                     new {  inwardId }, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
            PostProcessInward(inwardTypeScriptModel);
            return inwardTypeScriptModel;
        }
        private string GetCustomerNameById(int customerId) {
            string sql = @"SELECT CONCAT(ISNULL(clientName,''),'     ',ISNULL(companyName,'')) as searchValue  
                          FROM tblClient where clientId=@customerId and ISNULL(isDeleted,0)<>1;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                return connection.QueryFirst<string>(sql, new { customerId });

            }
        }

        private InwardModel PostProcessInward(InwardTypeScriptModel inwardModel)
        {
            //Process Inward Date
            if (inwardModel.InwardDate != null)
            {

                inwardModel.NgbInwardDate = new NgbDateModel
                {
                    year = inwardModel.InwardDate.Value.Year,
                    month = inwardModel.InwardDate.Value.Month,
                    day = inwardModel.InwardDate.Value.Day
                };
            }

            //Process Customer Information
            inwardModel.CustomerTypeAhead = new TypeAheadResponseModel { searchId= inwardModel.clientRefId,
                                                       searchValue= GetCustomerNameById(inwardModel.clientRefId)};

            
            inwardModel.ModelNoTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.ModelNo,
                searchId = inwardModel.InwardId
            };
            inwardModel.MaterialTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.MaterialType,
                searchId = inwardModel.InwardId
            };
            inwardModel.CompanyNameTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.CompanyName,
                searchId = inwardModel.InwardId
            };

            if (inwardModel.DeliveryDate != null)
            {

                inwardModel.NgbDeliveryDate = new NgbDateModel
                {
                    year = inwardModel.DeliveryDate.Value.Year,
                    month = inwardModel.DeliveryDate.Value.Month,
                    day = inwardModel.DeliveryDate.Value.Day
                };
            }

            //Process Accessories

            if (inwardModel.Accessories != null)
            {
                inwardModel.lstAccessories = new List<TypeAheadResponseModel>();
                string[] accessories =inwardModel.Accessories.Split("|");
                if (accessories != null && accessories.Count() > 0)
                {
                    for (int i = 0; i < accessories.Count(); i++)
                    {
                        inwardModel.lstAccessories.Add(new TypeAheadResponseModel
                        {
                            searchId = inwardModel.InwardId,
                            searchValue = accessories[i]
                        });
                    }

                   
                }
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
