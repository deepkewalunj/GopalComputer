using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Common;
using Gopal.Services.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Route("api/TypeAheadCommon")]
    [ApiController]
    [Authorize]
    public class TypeAheadCommonController : ControllerBase
    {
        ITypeAheadService _typeaheadService;
        public TypeAheadCommonController(ITypeAheadService typeaheadService)
        {
            _typeaheadService = typeaheadService;
        }

        [HttpPost]
        [Route("GetTypeAheadList")]
        public ActionResult GetTypeAheadList(TypeAheadRequestModel request)
        {
            List<TypeAheadResponseModel> lstTypeAheadResponseModel = new List<TypeAheadResponseModel>();
            switch (request.listType)
            {
                case TYPEAHEAD_LIST.TYPEAHEAD_CUSTOMER:
                    lstTypeAheadResponseModel = _typeaheadService.GetTypeAheadCustomer(request);
                    break;
                case TYPEAHEAD_LIST.TYPEAHEAD_MATERIAL:
                    lstTypeAheadResponseModel = _typeaheadService.GetTypeAheadModelMaterial(request);
                    break;
                case TYPEAHEAD_LIST.TYPEAHEAD_INVENTORY:
                    lstTypeAheadResponseModel = _typeaheadService.GetTypeAheadInventory(request);
                    break;
                case TYPEAHEAD_LIST.TYPEAHEAD_JOBNUMBER:
                    lstTypeAheadResponseModel = _typeaheadService.GetTypeAheadJobNumber(request);
                    break;
                case TYPEAHEAD_LIST.TYPEAHEAD_CUSTOMERNAME:
                    lstTypeAheadResponseModel = _typeaheadService.GetTypeAheadCustomerNameOnly(request);
                    break;
            }

            return Ok(lstTypeAheadResponseModel);
        }


    }
}