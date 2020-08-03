using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Report
{
    public class AccountStatementModel
    {
        public string normalPrinterName { get; set; }
        public string fromDate { get; set; }
        public string toDate { get; set; }
        public string accountName { get; set; }
        public decimal billOpeningBalance { get; set; }

        public decimal outwardOpeningBalance { get; set; }

        public decimal leftSideOutstandingAmount { get; set; }

        public decimal billPlusOutwardOpeningBalance { get; set; }

        public decimal rightSideClosingBalance { get; set; }
        public decimal rightSideBottomAmount { get; set; }
        public List<BillPayment> BillPaymentDetails { get; set; }
        public List<BillPayment> OutwardPaymentDetails { get; set; }
        public List<LumpsumPayment> LumpsumPaymentDetails { get; set; }
        public string addressPrint { get; set; }
        public string contactPrint { get; set; }

    }

    public class BillPayment
    {
        public DateTime? billDate { get; set; }
        public int billNumber { get; set; }
        public string jobNumber { get; set; }
        public decimal serviceAmount { get; set; }
        public decimal advancedAmount { get; set; }
        public decimal paidImmidiateAmount { get; set; }
        public decimal outstandingAmount { get; set; }
        
    }

    public class LumpsumPayment
    {
        public DateTime? billDate { get; set; }
        public string paymentMode { get; set; }
        public decimal paidAmount { get; set; }
    }
}
