using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Customer
{
    public class CustomerModel
    {
        public int clientId         { get; set; }
        public int clientTitleId    { get; set; }
        public string clientName    { get; set; }
        public string companyName    { get; set; }
        public string clientAddress   { get; set; }
        public string ownerMobileNo   { get; set; }
        public string mobileNoFirst   { get; set; }
        public string telNoFirst     { get; set; }
        public string telNoSecond    { get; set; }
    }
}
