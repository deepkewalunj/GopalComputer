using Gopal.Models.Common;
using Gopal.Models.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Outward
{
    public class OutwardModel
    {
        public DateTime? outwardDate { get; set; }
        public int? outwardId { get; set; }
        public string enggName { get; set; }
        public string testedOk { get; set; }
        public string materialUsed { get; set; }
        public decimal? serviceAmount { get; set; }
        public decimal? advanceAmount { get; set; }
        public decimal? paidImmediatlyAmount { get; set; }
        public decimal? outstandingAmount { get; set; }
        public string printStatus { get; set; }
        public string materialAdded { get; set; }
        public string paymentMode { get; set; }
        public string paymentRecievedBy { get; set; }
        public string smsSent { get; set; }
        public int? createdBy { get; set; }
        public string chequeNo { get; set; }
        public DateTime? chequeDate { get; set; }
        public string companyName { get; set; }
        public string jobNumbers { get; set; }
    }
    public class OutwardTypeScriptModel : OutwardModel
    {
        public List<TypeAheadResponseModel> lstJobNumbers { get; set; }
        public NgbDateModel ngbOutwardDate { get; set; }
        public NgbDateModel ngbChequeDate { get; set; }
    }

    public class OutwardListModel
    {
        public int outwardId { get; set; }
        public string jobNumbers { get; set; }
        public string enggName { get; set; }
        public DateTime? outwardDate { get; set; }
        public decimal serviceAmount { get; set; }
        public decimal advanceAmount { get; set; }
        public decimal paidImmediatlyAmount { get; set; }
        public decimal outstandingAmount { get; set; }

    }
}
