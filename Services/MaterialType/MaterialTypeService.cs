using Gopal.EntityFrameworkCore;
using Gopal.Models.MaterialType;
using Gopal.Models.User;
using Gopal.Services.MaterialType;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Gopal.Services.MaterialType
{
    public class MaterialTypeService : IMaterialTypeServices
    {
        
        private readonly gopal_dbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public MaterialTypeService(gopal_dbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;


        }

        
        public TblSearchModelNoMaterialTypeCompanyName GetSearchModelNoMaterialTypeCompanyNameById(int searchId)
        {
            return _dbContext.TblSearchModelNoMaterialTypeCompanyName.Where(x => x.IsDeleted != true && x.SearchId == searchId).FirstOrDefault();
        }

        public int GetCurrentUserId() {
            Int32.TryParse(_httpContextAccessor.HttpContext.User.FindFirst("userId").Value, out int userId);
            return userId;
        }

        

        public List<TblSearchModelNoMaterialTypeCompanyName> GetSearchModelNoMaterialTypeCompanyNames()
        {
            return _dbContext.TblSearchModelNoMaterialTypeCompanyName.Where(x => x.IsDeleted != true).ToList();
        }

        public object SaveSearchModelNoMaterialTypeCompanyNameData(tblSearchModelNoMaterialTypeCompanyNameInputModel model)
        {
            // check enrty already exist or not
            var isTblSearchModelNoMaterialTypeCompanyNameExist = _dbContext.TblSearchModelNoMaterialTypeCompanyName.Any(x => x.IsDeleted != true &&
                                                             x.ModelNo.ToUpper() == model.modelNo.ToUpper() &&
                                                             x.MaterialType.ToUpper() == model.materialType.ToUpper() &&
                                                             x.CompanyName.ToUpper() == model.companyName.ToUpper());
            if (isTblSearchModelNoMaterialTypeCompanyNameExist)
            {
                return "ALREADY_EXIST";
            }
            //

            var searchModelNoMaterialTypeCompanyNameObj = _dbContext.TblSearchModelNoMaterialTypeCompanyName.Where(x => x.IsDeleted != true && x.SearchId == model.searchId).FirstOrDefault();
            if(searchModelNoMaterialTypeCompanyNameObj != null)
            {
                searchModelNoMaterialTypeCompanyNameObj.ModelNo = model.modelNo;
                searchModelNoMaterialTypeCompanyNameObj.MaterialType = model.materialType;
                searchModelNoMaterialTypeCompanyNameObj.CompanyName = model.companyName;

                searchModelNoMaterialTypeCompanyNameObj.ModifiedBy = GetCurrentUserId();
                searchModelNoMaterialTypeCompanyNameObj.ModifiedDate = DateTime.Now;
                if(searchModelNoMaterialTypeCompanyNameObj.SearchId > 0)
                {
                    _dbContext.Entry(searchModelNoMaterialTypeCompanyNameObj).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                    return "UPDATED";
                }
            }
            else
            {
                TblSearchModelNoMaterialTypeCompanyName obj = new TblSearchModelNoMaterialTypeCompanyName();
                obj.ModelNo = model.modelNo;
                obj.MaterialType = model.materialType;
                obj.CompanyName = model.companyName;
                obj.CreatedBy = GetCurrentUserId(); 
                obj.CreatedDate = DateTime.Now;
                _dbContext.Add(obj);
                _dbContext.SaveChanges();
                return "INSERTED";
            }
            return "ERROR";
        }

        public int DeleteSearchModelNoMaterialTypeCompanyName(int searchId)
        {
            TblSearchModelNoMaterialTypeCompanyName searchModelNoMaterialTypeCompNameObj = _dbContext.TblSearchModelNoMaterialTypeCompanyName.FirstOrDefault(x => x.SearchId == searchId);
            if (searchModelNoMaterialTypeCompNameObj != null)
            {
                searchModelNoMaterialTypeCompNameObj.IsDeleted = true;
                searchModelNoMaterialTypeCompNameObj.ModifiedDate = DateTime.Now;
                searchModelNoMaterialTypeCompNameObj.ModifiedBy= GetCurrentUserId();
                _dbContext.SaveChanges();
            }
            return 0;
        }
    }
}
