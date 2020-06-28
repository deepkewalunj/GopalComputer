using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblSearchModelNoMaterialTypeCompanyName
    {
        public int SearchId { get; set; }
        public string ModelNo { get; set; }
        public string MaterialType { get; set; }
        public string CompanyName { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
