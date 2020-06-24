using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblClient
    {
        public int ClientId { get; set; }
        public int? ClientTitleId { get; set; }
        public string ClientName { get; set; }
        public string CompanyName { get; set; }
        public string ClientAddress { get; set; }
        public string OwnerMobileNo { get; set; }
        public string MobileNoFirst { get; set; }
        public string TelNoFirst { get; set; }
        public string TelNoSecond { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
