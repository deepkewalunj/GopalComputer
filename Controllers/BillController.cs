using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gopal.Models.Bill;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.Bill;
using Gopal.Services.Common;
using Gopal.Services.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gopal.Controllers
{
    [Route("api/Bill")]
    [ApiController]
    [Authorize]
    public class BillController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IBillServices _billServices;
        public string UPLOAD_PATH;
        public BillController(IHostingEnvironment hostingEnvironment,IBillServices billServices)
        {
            _hostingEnvironment = hostingEnvironment;
            _billServices = billServices;
            
        }

        [HttpPost]
        [Route("GetBillList")]
        public ActionResult GetBillList(DatatableRequestWrapper requestObjectWrapper)
        {

            return Ok(_billServices.GetBillList(requestObjectWrapper.getListModel));
        }

        [HttpPost]
        [Route("AddEditBill")]
        [DisableRequestSizeLimit]
        public ActionResult AddEditBill()
        {
            BillTypeScriptModel billModel = JsonConvert.DeserializeObject<BillTypeScriptModel>(Request.Form["bill"], new TrimmingConverter());


            billModel =  _billServices.AddEditBill(billModel);
            
            return Ok(billModel);
        }
       
        [HttpGet]
        [Route("GetBillById")]
        public ActionResult GetBillById(int billId)
        {
            return Ok(_billServices.GetBillById(billId));
        }

        [HttpGet]
        [Route("CheckBillIsGeneratedForJob")]
        public ActionResult CheckBillIsGeneratedForJob(int billId, int inwardId)
        {
            return Ok(_billServices.CheckBillIsGeneratedForJob(billId, inwardId));
        }

        

        [HttpGet]
        [Route("DeleteBill")]
        public ActionResult DeleteBill(int billId)
        {
            return Ok(_billServices.DeleteBill(billId));
        }

        
    }
}