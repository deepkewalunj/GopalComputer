using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Common
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
    public enum MODEL_ERRORS
    {
        CUSTOMER_ALREADY_EXIST = 1001,
        CUSTOMER_INWARD_EXIST= 1002,
        CUSTOMER_BILL_INWARD_OUTWARD_EXIST=1003
    }
}
