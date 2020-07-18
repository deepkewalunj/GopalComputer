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

        List<TypeAheadResponseModel> GetTypeAheadInventory(TypeAheadRequestModel request);
        List<TypeAheadResponseModel> GetTypeAheadJobNumber(TypeAheadRequestModel request);

        List<TypeAheadResponseModel> GetTypeAheadCustomerNameOnly(TypeAheadRequestModel request);

    }
}
