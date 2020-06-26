using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblModulePermission
    {
        public int ModulePermissionIdRef { get; set; }
        public int? ModuleIdRef { get; set; }
        public int? UserUserIdRef { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
