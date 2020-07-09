using Gopal.Models.Common;
using Gopal.Models.Outward;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Outward
{
   public interface IOutwardServices
    {
        DatatableResponseModel GetOutwardList(DatatableRequestModel getOutwardModel);
        OutwardTypeScriptModel AddEditOutward(OutwardTypeScriptModel outwardModel);
        OutwardTypeScriptModel GetOutwardById(int outwardId);

        int DeleteOutward(int outwardId);
    }
}
