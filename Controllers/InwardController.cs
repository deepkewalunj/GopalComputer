using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.Customer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gopal.Controllers
{
    [Route("api/Inward")]
    [ApiController]
    public class InwardController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IInwardServices _inwardServices;
        public InwardController(IHostingEnvironment hostingEnvironment,IInwardServices inwardServices)
        {
            _hostingEnvironment = hostingEnvironment;
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
        public ActionResult AddEditCustomer()
        {
            InwardTypeScriptModel inwardModel = JsonConvert.DeserializeObject<InwardTypeScriptModel>(Request.Form["inward"]);

            IFormFileCollection files = Request.Form.Files;
            if (files?.Count() > 0)
            {
                ProcessInwardFiles(files, inwardModel);
            }
            return Ok(_inwardServices.AddEditInward(inwardModel));
        }

        private void ProcessInwardFiles(IFormFileCollection files, InwardTypeScriptModel inwardModel)
        {
            string folderName = "Uploads";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    FileInfo finfo = new FileInfo(fileName);
                    String uniqueFileName = Guid.NewGuid().ToString() + finfo.Extension;
                    string fullPath = Path.Combine(newPath, uniqueFileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    inwardModel.inwardFiles.ForEach((inwardfile) =>
                    {
                        if(inwardfile.uniqueFilename== file.Name)
                        {
                            inwardfile.uniqueFilename = uniqueFileName;
                            inwardfile.originalFilename = fileName;
                        }
                    });
                }
            }
           
        }

        [HttpGet]
        [Route("GetInwardById")]
        public ActionResult GetInwardById(int inwardId)
        {
            return Ok(_inwardServices.GetInwardById(inwardId));
        }

        [HttpGet]
        [Route("GetInwardBarcode")]
        public ActionResult GetInwardBarcode(int inwardId)
        {
            string folderName = "Uploads";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            List<String> lstAccessories= _inwardServices.GetAccessories(inwardId);
            string accessories= lstAccessories != null && lstAccessories.Count() > 0 ? String.Join(",", lstAccessories) : String.Empty;
            string savePath= $"{Guid.NewGuid()}.jpg";
            newPath = $"{newPath}/{savePath}";
            BarcodeLib.Barcode b = new BarcodeLib.Barcode();
            b.AlternateLabel = accessories;
            b.LabelPosition = BarcodeLib.LabelPositions.BOTTOMRIGHT;
            b.IncludeLabel = true;
           
            b.Encode(BarcodeLib.TYPE.CODE39, $"{inwardId}", Color.Black, Color.White, 290, 120)
                .Save(newPath);
            _inwardServices.UpdateBarCodePathByInwardId(inwardId, savePath);
           
            return Ok(newPath);
        }



        [HttpGet]
        [Route("DeleteInWard")]
        public ActionResult DeleteInWard(int inwardId)
        {
            return Ok(_inwardServices.DeleteInward(inwardId));
        }

        
    }
}