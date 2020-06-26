using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TbleUserRole
    {
        public int UserRoleId { get; set; }
        public string UserRoleName { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
