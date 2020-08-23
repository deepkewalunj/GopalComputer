using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Gopal.Services.Common;
using RestSharp;
using Microsoft.AspNetCore.Authorization;

namespace Gopal.Controllers
{
    [Route("api/Email")]
    [ApiController]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private IEmailService _emailService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public EmailController(IEmailService emailService, IHttpContextAccessor httpContextAccessor) {
            _emailService = emailService;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpPost("SendEmailToCA")]
        public ActionResult SendEmailToCA() {
          
            IFormFileCollection files = Request.Form.Files;
            EmailModel emailModel = new EmailModel();
            emailModel.toList = new List<string>();
            emailModel.attachments = new List<EmailFileModel>();
            emailModel.subject = "Bill Report- Gopal Computers";
            emailModel.messageBody = "Please see the attached Bill Report.";
            emailModel.toList.Add(_emailService.GetCAEmailAddress());
            if (files?.Count() > 0)
            {
                foreach (var file in files)
                {
                    emailModel.attachments.Add(new EmailFileModel {
                        file=file.GetBytes(),
                        fileName= "Bill_Report.pdf"
                    });
                }
            }
            
            Task.Factory.StartNew(() => { _emailService.SendEmail(emailModel); });
            
            return Ok();
        }
        [HttpGet("SendAccountStatementEmail")]
        public ActionResult SendAccountStatementEmail(int id, int fd, int fm, int fy, int td, int tm, int ty) {
            string protocol = _httpContextAccessor.HttpContext.Request.IsHttps ? "https" : "http";
            string requestUrl =$" {protocol}://{_httpContextAccessor.HttpContext.Request.Host.Value}";

            var restClient = new RestClient(requestUrl);
            var request = new RestRequest(Method.GET);
            request.Resource = $"api/pdf/PrintAccountStatement?id={id}&fd={fd}&fm={fm}&fy={fy}&td={td}&tm={tm}&ty={ty}";

            byte[] response = restClient.DownloadData(request);
            if (response != null)
            {
                EmailModel emailModel = new EmailModel();
                emailModel.toList = new List<string>();
                emailModel.attachments = new List<EmailFileModel>();
                emailModel.subject = "Account Statement- Gopal Computers";
                emailModel.messageBody = "Please see the attached Account Statement.";
                emailModel.toList.Add(_emailService.GetClientEmailAddressById(id));

                emailModel.attachments.Add(new EmailFileModel
                {
                    file = response,
                    fileName = "Account_Statement.pdf"
                });


                Task.Factory.StartNew(() => { _emailService.SendEmail(emailModel); });

            }

            return Ok();
        }

    }
}