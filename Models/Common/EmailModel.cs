using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Common
{
    public class EmailModel
    {
        public List<String> toList { get; set; }
        public List<EmailFileModel> attachments { get; set; }
        public string messageBody { get; set; }
        public string subject { get; set; }
        public List<string> bccToEmails { get; set; }
        public List<string> ccToEmails { get; set; }
    }

    public class EmailFileModel
    {
        public Byte[] file { get; set; }
        public string fileName { get; set; }
    }

    public class EmailCredential {
        public string Email_User { get; set; }
        public string Email_Server { get; set; }
        public int Email_Port { get; set; }
        public string Email_Password { get; set; }
    }
}
