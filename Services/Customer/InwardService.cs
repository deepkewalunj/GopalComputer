﻿using Dapper;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Models.User;
using Gopal.Services.User;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
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
                    datatableResponseModel.data  = multi.Read<InwardListModel>()?.ToList();
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
                inwardModel.inwardId = connection.Query<int>("usp_AddEditInward",
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

        
        private String GetSearchValue(Object searchModel) {
            Type modelType = searchModel.GetType();
            if (modelType == typeof(string)) {
                return (String)searchModel;
            }
            return ((JObject)searchModel).ToObject<TypeAheadResponseModel>().searchValue;
        }

        private InwardModel PreProcessInward(InwardTypeScriptModel inwardModel)
        {
            //Process Inward Date
            inwardModel.inwardDate = new DateTime(inwardModel.ngbInwardDate.year, 
                                         inwardModel.ngbInwardDate.month, 
                                         inwardModel.ngbInwardDate.day);

            //Process Customer Information
            inwardModel.clientRefId = inwardModel.customerTypeAhead.searchId;

            //Search Inward Details
            bool isMaterialExist = IsMaterialExist(GetSearchValue(inwardModel.modelNoTypeAhead) ,
             GetSearchValue(inwardModel.materialTypeAhead)   , GetSearchValue(inwardModel.companyNameTypeAhead));
            if (!isMaterialExist)
            {
                //Insert it for Search
                InsertintoTblSearchMaterialType(GetSearchValue(inwardModel.modelNoTypeAhead) ,
              GetSearchValue(inwardModel.materialTypeAhead)  , GetSearchValue(inwardModel.companyNameTypeAhead));
            }

            inwardModel.modelNo = GetSearchValue(inwardModel.modelNoTypeAhead);
            inwardModel.materialType = GetSearchValue(inwardModel.materialTypeAhead);
            inwardModel.companyName = GetSearchValue(inwardModel.companyNameTypeAhead);


            //Process Delivery Date
            inwardModel.deliveryDate = new DateTime(inwardModel.ngbDeliveryDate.year,
                                        inwardModel.ngbDeliveryDate.month,
                                        inwardModel.ngbDeliveryDate.day);

            //Process Accessories
            
            if (inwardModel.lstAccessories != null && inwardModel.lstAccessories.Count > 0)
            {
                List<String> lstAccessories = new List<String>();
                inwardModel.lstAccessories.ForEach(accesory =>
                {
                    if (!IsAccessoriesExist(GetSearchValue(inwardModel.materialTypeAhead) , accesory.searchValue))
                    {
                        InsertintoTblMaterialAccessories(GetSearchValue(inwardModel.materialTypeAhead), accesory.searchValue);
                    }
                    lstAccessories.Add(accesory.searchValue);
                });
                inwardModel.accessories = String.Join('|', lstAccessories);
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
            string sql = @"SELECT CONCAT(ISNULL(companyName,''),'     ', ISNULL(clientName,'')) as searchValue  
                          FROM tblClient where clientId=@customerId and ISNULL(isDeleted,0)<>1;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                return connection.QueryFirst<string>(sql, new { customerId });

            }
        }

        public string GetCustomerNameByIdForBarcode(int customerId)
        {
            string sql = @"SELECT CONCAT(ISNULL(companyName,''),' ',ISNULL(clientName,'')) as searchValue  
                          FROM tblClient where clientId=@customerId and ISNULL(isDeleted,0)<>1;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                return connection.QueryFirst<string>(sql, new { customerId });

            }
        }

        private List<string> GetInwardBarCodeZPL(InwardTypeScriptModel inwardModel) {
            string ZPL = @"^XA$$
                          ^FO60,25^BY3^BCN,43,N,,,A^FD##BARCODE##^FS$$
                          ^FO350,30^A0,40^FD##BARCODE##^FS$$
                          ^FO60,76^A0,25^FD##COMPANYNAME##^FS$$
                          ^FO60,99^A2,20^FD##ACCESSORIES##^FS$$
                          ^FO60,120^A2,20^FDPROB: ##PROBLEMDESCRIPTION##^FS$$
                          ^FO370,142^A2,20^FD##INWARDDATE##^FS$$
                          ^FO60,167^A2,20^FDREPAIRED:     YES      NO^FS$$
                          ^FO272,163^GB40,25,3^FS
                          ^FO367,163^GB40,25,3^FS
                          ^XZ";
            var replacements = new Dictionary<string, string>
            {
                ["BARCODE"] = inwardModel.inwardId.ToString(),
                ["COMPANYNAME"] = inwardModel.clientName?.ToUpper(),
                ["ACCESSORIES"] = inwardModel.accessories?.ToUpper(),
                ["PROBLEMDESCRIPTION"] = inwardModel.problemDescription?.ToUpper(),
                ["INWARDDATE"] = $"{inwardModel.ngbInwardDate.day}/{inwardModel.ngbInwardDate.month}/{inwardModel.ngbInwardDate.year}"
            
            };
            var pattern = $"##(?<placeholder>{string.Join("|", replacements.Keys)})##";
            var result = Regex.Replace(ZPL, pattern, m => replacements[m.Groups["placeholder"].Value], RegexOptions.ExplicitCapture);
            List<String> lstZPLBarCode = result.Split("$$")?.ToList();
            return lstZPLBarCode;

        }
        private InwardModel PostProcessInward(InwardTypeScriptModel inwardModel)
        {
            //Process Inward Date
            if (inwardModel.inwardDate != null)
            {

                inwardModel.ngbInwardDate = new NgbDateModel
                {
                    year = inwardModel.inwardDate.Value.Year,
                    month = inwardModel.inwardDate.Value.Month,
                    day = inwardModel.inwardDate.Value.Day
                };
            }

            //Process Customer Information
            inwardModel.customerTypeAhead = new TypeAheadResponseModel { searchId= inwardModel.clientRefId,
                                                       searchValue= GetCustomerNameById(inwardModel.clientRefId)};

            
            inwardModel.modelNoTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.modelNo,
                searchId = inwardModel.inwardId
            };
            inwardModel.materialTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.materialType,
                searchId = inwardModel.inwardId
            };
            inwardModel.companyNameTypeAhead = new TypeAheadResponseModel
            {
                searchValue = inwardModel.companyName,
                searchId = inwardModel.inwardId
            };

            if (inwardModel.deliveryDate != null)
            {

                inwardModel.ngbDeliveryDate = new NgbDateModel
                {
                    year = inwardModel.deliveryDate.Value.Year,
                    month = inwardModel.deliveryDate.Value.Month,
                    day = inwardModel.deliveryDate.Value.Day
                };
            }

            //Process Accessories

            if (inwardModel.accessories != null)
            {
                inwardModel.lstAccessories = new List<TypeAheadResponseModel>();
                string[] accessories =inwardModel.accessories.Split("|");
                if (accessories != null && accessories.Count() > 0)
                {
                    for (int i = 0; i < accessories.Count(); i++)
                    {
                        inwardModel.lstAccessories.Add(new TypeAheadResponseModel
                        {
                            searchId = inwardModel.inwardId,
                            searchValue = accessories[i]
                        });
                    }

                   
                }
            }

            //Get Inward files
            List<FilePOCO> lstFiles= GetInwardFiles(inwardModel.inwardId);
            if (lstFiles != null && lstFiles.Count() > 0)
            {
                inwardModel.inwardFiles = lstFiles;
            }

            inwardModel.inwardBarCodeZPL=  GetInwardBarCodeZPL(inwardModel);
            inwardModel.normalPrinterName = _dbContext.TblMaster.FirstOrDefault(x => x.MasterKey == "NORMAL_PRINTER").MasterValue;
            inwardModel.barCodePrinterName = _dbContext.TblMaster.FirstOrDefault(x => x.MasterKey == "BARCODE_PRINTER").MasterValue;
            return inwardModel;
        }

        public List<FilePOCO> GetInwardFiles(int inwardId) {
            List<FilePOCO> filePOCOs = null;
            string sql = @"SELECT inwardDocumentId as documentId,documentName as originalFilename,
                            documentPath as documentPath
                          FROM tblInwardDocument where inwardRefId=@inwardId and ISNULL(isDeleted,0)<>1;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                filePOCOs= connection.Query<FilePOCO>(sql, new { inwardId })?.ToList();

            }
            return filePOCOs;
        }

        public bool IsInwardBillExist(int inwardId) {
            return _dbContext.TblBillAndInwardDetail.Any(inward => inward.InwardIdRef == inwardId && inward.IsDeleted == false);
        }


        public bool IsOutwardBillExist(int inwardId) {
            return _dbContext.TblOutwardAndInwardDetail.Any(inward => inward.InwardIdRef == inwardId && inward.IsDeleted == false);
        }

        public bool IsInwardBillOrOutwardBillExist(int inwardId)
        {
            return IsInwardBillExist(inwardId) || IsOutwardBillExist(inwardId);
        }

        public int DeleteInward(int inwardId, ModelStateDictionary modelState) {
            if (IsInwardBillOrOutwardBillExist(inwardId))
            {
                modelState.AddModelError($"{(int)MODEL_ERRORS.CUSTOMER_BILL_INWARD_OUTWARD_EXIST}","Inward cannot be deleted because inward and outward bill exists.");
                return inwardId;
            }
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


        public List<String> GetAccessories(int inwardId) {
            List<String> lstAccessories = null;
            string sql = @"SELECT accessories
                          FROM tblInward where inwardId=@inwardId and ISNULL(isDeleted,0)<>1;";

            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                string accessory= connection.QueryFirst<string>(sql, new { inwardId });
                if (accessory != null)
                {
                    lstAccessories = accessory.Split("|")?.ToList();
                }

            }
            return lstAccessories;
        }
        


        public void UpdateBarCodePathByInwardId(int inwardId,string barCodePath) {
            string sql = @"UPDATE tblInward SET barCode=@barCodePath WHERE inwardId=@inwardId;";
            using (var connection = new SqlConnection(ConnectionHelper.GetConnectionString()))
            {
                 connection.ExecuteScalar<int>(sql, new { inwardId, barCodePath });
               

            }
        }


    }
}
