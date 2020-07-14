using Gopal.Models.Common;
using Gopal.Models.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Services.Payment
{
    public interface IPaymentServices
    {
        DatatableResponseModel GetLumpsumList(DatatableRequestModel getLumpsumModel);
        LumpsumTypeScriptModel AddEditLumpsum(LumpsumTypeScriptModel lumpsumModel);
        LumpsumTypeScriptModel GetLumpsumById(int lumpsumId);
        int DeleteLumpsum(int lumpsumId);
        statementAmounts getStatementAmount(int clientRefId);
    }
}
