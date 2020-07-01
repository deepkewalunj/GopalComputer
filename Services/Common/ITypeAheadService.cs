using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Common
{
    public interface ITypeAheadService
    {
        List<TypeAheadResponseModel> GetTypeAheadModelMaterial(TypeAheadRequestModel request);
        List<TypeAheadResponseModel> GetTypeAheadCustomer(TypeAheadRequestModel request);
    }
}
