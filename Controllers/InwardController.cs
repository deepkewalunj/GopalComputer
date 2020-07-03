using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.Customer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Route("api/Inward")]
    [ApiController]
    public class InwardController : ControllerBase
    {

        private IInwardServices _inwardServices;
        public InwardController(IInwardServices inwardServices)
        {
            _inwardServices = inwardServices;

        }


        [HttpPost]
        [Route("GetInwardList")]
        public ActionResult GetInwardList(DatatableRequestWrapper requestObjectWrapper)
        {

            return Ok(_inwardServices.GetInwardList(requestObjectWrapper.getListModel));
        }

        [HttpPost]
        [Route("AddEditInWard")]
        [DisableRequestSizeLimit]
        public ActionResult AddEditCustomer(InwardTypeScriptModel inward)
        {

            return Ok(_inwardServices.AddEditInward(inward));
        }

        [HttpGet]
        [Route("GetInwardById")]
        public ActionResult GetInwardById(int inwardId)
        {
            return Ok(_inwardServices.GetInwardById(inwardId));
        }

        [HttpGet]
        [Route("DeleteInWard")]
        public ActionResult DeleteInWard(int inwardId)
        {
            return Ok(_inwardServices.DeleteInward(inwardId));
        }

        
    }
}