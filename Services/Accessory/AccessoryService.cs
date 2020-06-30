using Gopal.EntityFrameworkCore;
using Gopal.Models.Accessory;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Accessory
{
    public class AccessoryService : IAccessoryServices
    {
        private readonly gopal_dbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccessoryService(gopal_dbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public bool deleteAccessory(int accessoryId)
        {
            TblMaterialAccessory acc = _dbContext.TblMaterialAccessory.FirstOrDefault(x => x.MaterialAccessoryId == accessoryId);
            if (acc != null)
            {
                acc.IsDeleted = true;
                acc.ModifiedDate = DateTime.Now;
                acc.ModifiedBy = GetCurrentUserId();
                _dbContext.SaveChanges();
            }
            return true;
        }

        public List<TblMaterialAccessory> getAccessories()
        {
            return _dbContext.TblMaterialAccessory.Where(x => x.IsDeleted != true).ToList();
        }

        public TblMaterialAccessory getAccessoryById(int accessoryId)
        {
            return _dbContext.TblMaterialAccessory.Where(x => x.IsDeleted != true && x.MaterialAccessoryId == accessoryId).FirstOrDefault();
        }

        public bool saveAccessory(AccessoryInputModel model)
        {
            var acc = _dbContext.TblMaterialAccessory.Where(x => x.IsDeleted != true && x.MaterialAccessoryId == model.materialAccessoryId).FirstOrDefault();
            if (acc != null)
            {
                acc.MaterialType = model.materialType;
                acc.AccessoryName = model.accessoryName;
                acc.ModifiedBy = GetCurrentUserId();
                acc.ModifiedDate = DateTime.Now;
                if (acc.MaterialAccessoryId > 0)
                {
                    _dbContext.Entry(acc).State = EntityState.Modified;
                    _dbContext.SaveChanges();
                }
            }
            else
            {
                TblMaterialAccessory accObj = new TblMaterialAccessory();
                accObj.MaterialType = model.materialType;
                accObj.AccessoryName = model.accessoryName;
                accObj.CreatedBy = GetCurrentUserId();
                accObj.CreatedDate = DateTime.Now;
                _dbContext.Add(accObj);
                _dbContext.SaveChanges();
            }
            return true;
        }


        public int GetCurrentUserId()
        {
            Int32.TryParse(_httpContextAccessor.HttpContext.User.FindFirst("userId").Value, out int userId);
            return userId;
        }
    }
}
