using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
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
        public string UPLOAD_PATH;
        public InwardController(IHostingEnvironment hostingEnvironment,IInwardServices inwardServices)
        {
            _hostingEnvironment = hostingEnvironment;
            _inwardServices = inwardServices;
            
        }

        private string GetUploadFolderPath() {
            string folderName = "Uploads";
            string webRootPath = _hostingEnvironment.WebRootPath;
           return Path.Combine(webRootPath, folderName);
        }
        private string GetFontFolderPath()
        {
            string folderName = "Fonts";
            string webRootPath = _hostingEnvironment.WebRootPath;
            return Path.Combine(webRootPath, folderName);
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
        public ActionResult AddEditInWard()
        {
            InwardTypeScriptModel inwardModel = JsonConvert.DeserializeObject<InwardTypeScriptModel>(Request.Form["inward"]);
           
            IFormFileCollection files = Request.Form.Files;
            if (files?.Count() > 0)
            {
                ProcessInwardFiles(files, inwardModel);
            }
            inwardModel=  _inwardServices.AddEditInward(inwardModel);
            if (!(String.IsNullOrEmpty(inwardModel.barCode) || String.IsNullOrWhiteSpace(inwardModel.barCode)))
            {
                DeletePreviousBarCode(inwardModel.barCode);
            }
            SaveInwardBarcode(inwardModel);
            return Ok(inwardModel);
        }
        public void DeletePreviousBarCode(string barCodePath)
        {
            
            string filePath = Path.Combine(GetUploadFolderPath(), barCodePath);
            
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            string simpleFilePath = Path.Combine(GetUploadFolderPath(), $"simple_{barCodePath}");
            if (System.IO.File.Exists(simpleFilePath))
            {
                System.IO.File.Delete(simpleFilePath);
            }
        }

        private void ProcessInwardFiles(IFormFileCollection files, InwardTypeScriptModel inwardModel)
        {
            string newPath = GetUploadFolderPath();
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

        
        public void SaveInwardBarcode(InwardTypeScriptModel inwardModel)
        {
            
            string newPath = GetUploadFolderPath();
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            List<String> lstAccessories= _inwardServices.GetAccessories(inwardModel.inwardId);
            string customerName = _inwardServices.GetCustomerNameByIdForBarcode(inwardModel.clientRefId);
            string accessories  = String.Join(",", lstAccessories);
            string savePath= $"{Guid.NewGuid()}.jpg";
            
            string simpleBarCodePath = $"{newPath}/{savePath}";
            Image image = GetBarCodeImage(inwardModel.inwardId, 245, 70, true, true, $"{inwardModel.inwardId}");
            image.Save(simpleBarCodePath);

           
            _inwardServices.UpdateBarCodePathByInwardId(inwardModel.inwardId, savePath);
           
            
        }

        private Image GetBarCodeImage(int inwardId, int width, int height, bool isCentre=false,bool isAlternateText=false,string alternateText=null) {
            BarcodeLib.Barcode b = new BarcodeLib.Barcode();

            b.ImageFormat = System.Drawing.Imaging.ImageFormat.Png;
            if (isAlternateText)
            {
                b.AlternateLabel = $"{alternateText}";
                b.IncludeLabel = true;
                if (isCentre)
                {
                    b.LabelPosition = BarcodeLib.LabelPositions.BOTTOMCENTER;
                }
                else
                b.LabelPosition = BarcodeLib.LabelPositions.BOTTOMLEFT;
            }
            b.Alignment = BarcodeLib.AlignmentPositions.LEFT;
            Image image = b.Encode(BarcodeLib.TYPE.CODE39, $"{inwardId}", Color.Black, Color.White, width, height);
            return image;
        }

      
        [HttpGet]
        [Route("DeleteInWard")]
        public ActionResult DeleteInWard(int inwardId)
        {
            int customerId = _inwardServices.DeleteInward(inwardId, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(customerId);
        }

        
    }
}