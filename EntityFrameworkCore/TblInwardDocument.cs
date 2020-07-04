using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblInwardDocument
    {
        public int InwardDocumentId { get; set; }
        public int? InwardRefId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentPath { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
