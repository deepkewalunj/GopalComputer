using Gopal.Models.Common;
using Gopal.Models.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Payment
{
    public class LumpsumModel
    {
        public DateTime? lumpsumDate { get; set; }
        public int? lumpsumId { get; set; }
        
        public decimal? paidAmount { get; set; }
        public decimal? totalBillAmount { get; set; }
        public decimal? totalOutwordAmount { get; set; }
        public decimal? totalAmountDue { get; set; }
        public decimal? totalPaidAmount { get; set; }
        public decimal? outstandingAmount { get; set; }

        public string printStatus { get; set; }
        public string paymentMode { get; set; }
        public string paymentRecievedBy { get; set; }
        public string smsSent { get; set; }
        public int? createdBy { get; set; }
        public string chequeNo { get; set; }
        public DateTime? chequeDate { get; set; }
        public string customerName { get; set; }
        public string normalPrinterName { get; set; }
        public string gstNo { get; set; }
        public string customerAddress { get; set; }

    }

    public class LumpsumTypeScriptModel : LumpsumModel
    {
        public TypeAheadResponseModel customerNameData { get; set; }
        public NgbDateModel ngbLumpsumDate { get; set; }
        public NgbDateModel ngbChequeDate { get; set; }
        public int? clientRefId { get; set; }
        public string bankAccountNoPrint { get; set; }
        public string bankNamePrint { get; set; }
        public string ifscCodePrint { get; set; }
        public string gPayPrint { get; set; }
        public string inwardAddressPrint { get; set; }
        public string inwardAddressPhoneNoPrint { get; set; }
    }

    public class LumpsumListModel
    {
        public int lumpsumId { get; set; }
        public DateTime? lumpsumDate { get; set; }
        public decimal paidAmount { get; set; }
        public string customerName { get; set; }

    }

    public class statementAmounts
    {
        public decimal? totalBillAmount { get; set; }
        public decimal? totalOutwordAmount { get; set; }
        public decimal? totalAmountDue { get; set; }
        public decimal? totalPaidAmount { get; set; }
        public decimal? outstandingAmount { get; set; }
        public string  customerName { get; set; }

    }
}
