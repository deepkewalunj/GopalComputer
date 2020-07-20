using Gopal.EntityFrameworkCore;
using Gopal.Models.Accessory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Accessory
{
    public interface IAccessoryServices
    {
        List<TblMaterialAccessory> getAccessories();

        TblMaterialAccessory getAccessoryById(int accessoryId);

        object saveAccessory(AccessoryInputModel model);

        bool deleteAccessory(int accessoryId);
    }
}
