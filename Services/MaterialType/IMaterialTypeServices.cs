using Gopal.EntityFrameworkCore;
using Gopal.Models.MaterialType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.MaterialType
{
   public interface IMaterialTypeServices
    {
        List<TblSearchModelNoMaterialTypeCompanyName> GetSearchModelNoMaterialTypeCompanyNames();
        TblSearchModelNoMaterialTypeCompanyName GetSearchModelNoMaterialTypeCompanyNameById(int searchId);
        object SaveSearchModelNoMaterialTypeCompanyNameData(tblSearchModelNoMaterialTypeCompanyNameInputModel model);
        int DeleteSearchModelNoMaterialTypeCompanyName(int userId);
    }
}
