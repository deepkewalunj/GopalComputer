using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NLog;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Gopal.Services.Common
{
    public class EmailService: IEmailService
    {
        
        private ILog _logger;
       
        public EmailService(ILog logger) {

            _logger = logger;
            
        }

        public void SendSMS(SMSModel smsModel)
        {
            try
            {
                var clientSend = new RestClient("http://2factor.in/API/V1/" + smsModel.SMS_API_KEY + "/ADDON_SERVICES/SEND/TSMS");
                var requestSend = new RestRequest(Method.POST);
                requestSend.AddParameter("From", "GOPALc");
                requestSend.AddParameter("To", smsModel.To);
                requestSend.AddParameter("TemplateName", smsModel.TemplateName);
                if (!string.IsNullOrEmpty(smsModel.VAR1))
                {
                    requestSend.AddParameter("VAR1", smsModel.VAR1);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR2))
                {
                    requestSend.AddParameter("VAR2", smsModel.VAR2);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR3))
                {
                    requestSend.AddParameter("VAR3", smsModel.VAR3);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR4))
                {
                    requestSend.AddParameter("VAR4", smsModel.VAR4);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR5))
                {
                    requestSend.AddParameter("VAR5", smsModel.VAR5);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR6))
                {
                    requestSend.AddParameter("VAR6", smsModel.VAR6);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR7))
                {
                    requestSend.AddParameter("VAR7", smsModel.VAR7);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR8))
                {
                    requestSend.AddParameter("VAR8", smsModel.VAR8);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR9))
                {
                    requestSend.AddParameter("VAR9", smsModel.VAR9);
                }
                if (!string.IsNullOrEmpty(smsModel.VAR10))
                {
                    requestSend.AddParameter("VAR10", smsModel.VAR10);
                }
                IRestResponse responseSend = clientSend.Execute(requestSend);
            }
            catch (Exception ex)
            {
                _logger.Error($"SMS Sending Error :- {ex}");
            }
        }
        public void SendEmail(EmailModel emailModel) {
            EmailCredential credential=  GetEmailCredential();
            MailMessage message = new MailMessage();
            message.From =new MailAddress(credential.Email_User);
            List<MailAddress> mailToAddresses = new List<MailAddress>();

            emailModel.toList.ForEach(to => { message.To.Add(to); });
           
            message.Subject = emailModel.subject;
            message.Body = emailModel.messageBody;

            emailModel.attachments.ForEach(attachmentFile => 
            
            {
                var attachment = new Attachment(new MemoryStream(attachmentFile.file),
                                        attachmentFile.fileName,
                                        MediaTypeNames.Application.Pdf);
                attachment.ContentDisposition.FileName = "Outstanding_Report.pdf";
                message.Attachments.Add(attachment);
            });

            SmtpClient client = new SmtpClient(credential.Email_Server, credential.Email_Port)
            {
                Credentials = new NetworkCredential(credential.Email_User,credential.Email_Password),
                EnableSsl = true
            };
            // code in brackets above needed if authentication required 

            try
            {
                client.Send(message);
            }
            catch (Exception ex)
            {
                _logger.Error($"Email Sending Error :- {ex}");
            }
        }

        public string GetCAEmailAddress()
        {
           var _dbContext = new gopal_dbContext();
            return _dbContext.TblMaster.FirstOrDefault(x => x.MasterKey == "CA_EMAIL_ADDRESS")?.MasterValue;
          
        }

        public string GetClientEmailAddressById(int clientId)
        {
            var _dbContext = new gopal_dbContext();
            return _dbContext.TblClient.FirstOrDefault(x => x.ClientId == clientId)?.ClientEmail;

        }

        private EmailCredential GetEmailCredential() {
            EmailCredential credential = new EmailCredential();
            var _dbContext = new gopal_dbContext();
            List<TblMaster> lstMaster= _dbContext.TblMaster.ToList();
            if (lstMaster?.Count > 0) {
                credential.Email_User = lstMaster.FirstOrDefault(x => x.MasterKey == "EMAIL_USER").MasterValue;
                credential.Email_Password = lstMaster.FirstOrDefault(x => x.MasterKey == "EMAIL_PASSWORD").MasterValue;
                credential.Email_Server = lstMaster.FirstOrDefault(x => x.MasterKey == "EMAIL_SERVER").MasterValue;
                credential.Email_Port = Convert.ToInt32( lstMaster.FirstOrDefault(x => x.MasterKey == "EMAIL_PORT").MasterValue);
            }
            return credential;


        }

    }
}
