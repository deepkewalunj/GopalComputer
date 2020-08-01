using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Payment;
using Gopal.Services.Payment;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gopal.Controllers
{
    [Route("api/Payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IPaymentServices _paymentServices;

        public PaymentController(IHostingEnvironment hostingEnvironment, IPaymentServices paymentServices)
        {
            _hostingEnvironment = hostingEnvironment;
            _paymentServices = paymentServices;

        }

        [HttpPost]
        [Route("GetLumpsumList")]
        public ActionResult GetLumpsumList(DatatableRequestWrapper requestObjectWrapper)
        {

            return Ok(_paymentServices.GetLumpsumList(requestObjectWrapper.getListModel));
        }

        [HttpPost]
        [Route("AddEditLumpsum")]
        [DisableRequestSizeLimit]
        public ActionResult AddEditLumpsum()
        {
            LumpsumTypeScriptModel lumpsumModel = JsonConvert.DeserializeObject<LumpsumTypeScriptModel>(Request.Form["lumpsum"]);


            lumpsumModel = _paymentServices.AddEditLumpsum(lumpsumModel);

            return Ok(lumpsumModel);
        }

        [HttpGet]
        [Route("GetLumpsumById")]
        public ActionResult GetLumpsumById(int lumpsumId)
        {
            return Ok(_paymentServices.GetLumpsumById(lumpsumId));
        }

        [HttpGet]
        [Route("getStatementAmount")]
        public ActionResult getStatementAmount(int clientRefId)
        {
            return Ok(_paymentServices.getStatementAmount(clientRefId));
        }



        [HttpGet]
        [Route("DeleteLumpsum")]
        public ActionResult DeleteLumpsum(int lumpsumId)
        {
            return Ok(_paymentServices.DeleteLumpsum(lumpsumId));
        }

        [HttpPost]
        [Route("GetPaymentDetailsBySearch")]
        public ActionResult GetPaymentDetailsBySearch(GetPaymentDetailsBySearchModel searchModel) {
            return Ok(_paymentServices.GetPaymentDetailsBySearch(searchModel));
        }
    }
}
