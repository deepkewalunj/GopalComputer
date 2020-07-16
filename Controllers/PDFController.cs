using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Bill;
using Gopal.Models.Customer;
using Gopal.Services.Bill;
using Gopal.Services.Customer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Rotativa.AspNetCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Gopal.Controllers
{
   
    [Route("api/pdf")]
    public class PDFController : Controller
    {

        
        private IHostingEnvironment _hostingEnvironment;
        private IInwardServices _inwardServices;
        private IBillServices _billServices;
        public string UPLOAD_PATH;
        public PDFController(IHostingEnvironment hostingEnvironment, IInwardServices inwardServices, IBillServices billServices)
        {
            _hostingEnvironment = hostingEnvironment;
            _inwardServices = inwardServices;
            _billServices = billServices;

        }
        private string GetUploadFolderPath()
        {
            string folderName = "Uploads";
            string webRootPath = _hostingEnvironment.WebRootPath;
            return Path.Combine(webRootPath, folderName);
        }
        [HttpGet]
        [Route("PrintInward")]
        public IActionResult PrintInward(int inwardId)
        {

            if (inwardId <= 0)
            {
                return BadRequest("Invalid Inward Id.");
            }
           
           InwardTypeScriptModel inward =  _inwardServices.GetInwardById(inwardId);
           
            return new ViewAsPdf("PrintInward", inward);
        }

        [HttpGet]
        [Route("PrintBill")]
        public IActionResult PrintBill(int billId)
        {

            if (billId <= 0)
            {
                return BadRequest("Invalid Bill Id.");
            }

            BillTypeScriptModel bill = _billServices.GetBillById(billId);

            return new ViewAsPdf("PrintBill", bill);
        }
    }
}
