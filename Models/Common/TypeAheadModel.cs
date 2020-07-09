using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Common
{
    public class TypeAheadResponseModel
    {
        public int searchId { get; set; }
        public string searchValue { get; set; }
        public string splitValue { get; set; }
        public decimal? advanceAmount { get; set; }
        public int? clientRefId { get; set; }
        public string modelNo { get; set; }
        public string materialType { get; set; }
        public string companyName { get; set; }
        public string serialNo { get; set; }
        public bool? isRepaired { get; set; }
        public decimal? serviceAmount { get; set; }

    }
    public class TypeAheadRequestModel
    {
        public TYPEAHEAD_LIST listType;
        public string searchText { get; set; }
        public object searchType { get; set; }
    }

    public enum TYPEAHEAD_LIST{
        TYPEAHEAD_CUSTOMER=1,
        TYPEAHEAD_MATERIAL=2,
        TYPEAHEAD_INVENTORY=3,
        TYPEAHEAD_JOBNUMBER = 4,

    }
}
