using Gopal.Models.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Bill
{
    public class BillOutwardReportModel
    {

        public int reportId { get; set; }
        public int inwardId { get; set; }
        public DateTime? reportDate { get; set; }
        public float serviceAmount { get; set; }
        public float advanceAmount { get; set; }
        public float paidImmediatlyAmount { get; set; }
        public float outstandingAmount { get; set; }
    }

    public class BillOutwardReportSearchModel {
        public string customerName { get; set; }
        public int? billNo  { get; set; }
        public NgbDateModel reportFromDate { get; set; }
        public NgbDateModel reportToDate { get; set; }
    }
}
