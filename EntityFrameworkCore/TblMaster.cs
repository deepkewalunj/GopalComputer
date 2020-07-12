using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblMaster
    {
        public int MasterId { get; set; }
        public string MasterKey { get; set; }
        public string MasterValue { get; set; }
    }
}
