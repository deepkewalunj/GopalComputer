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
using Gopal.Models.Outward;
using Gopal.Services.Bill;
using Gopal.Services.Customer;
using Gopal.Services.Outward;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gopal.Controllers
{
    [Route("api/Outward")]
    [ApiController]
    public class OutwardController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IOutwardServices _outwardServices;
        public string UPLOAD_PATH;
        public OutwardController(IHostingEnvironment hostingEnvironment, IOutwardServices outwardServices)
        {
            _hostingEnvironment = hostingEnvironment;
            _outwardServices = outwardServices;
            
        }

        [HttpPost]
        [Route("GetOutwardList")]
        public ActionResult GetOutwardList(DatatableRequestWrapper requestObjectWrapper)
        {

            return Ok(_outwardServices.GetOutwardList(requestObjectWrapper.getListModel));
        }

        [HttpPost]
        [Route("AddEditOutward")]
        [DisableRequestSizeLimit]
        public ActionResult AddEditOutward()
        {
            OutwardTypeScriptModel outwardModel = JsonConvert.DeserializeObject<OutwardTypeScriptModel>(Request.Form["outward"]);


            outwardModel =  _outwardServices.AddEditOutward(outwardModel);
            
            return Ok(outwardModel);
        }
       
        [HttpGet]
        [Route("GetOutwardById")]
        public ActionResult GetOutwardById(int outwardId)
        {
            return Ok(_outwardServices.GetOutwardById(outwardId));
        }

        

        

        [HttpGet]
        [Route("DeleteOutward")]
        public ActionResult DeleteOutward(int outwardId)
        {
            return Ok(_outwardServices.DeleteOutward(outwardId));
        }

        
    }
}