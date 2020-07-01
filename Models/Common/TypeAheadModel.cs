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
    }
    public class TypeAheadRequestModel
    {
        public TYPEAHEAD_LIST listType;
        public string searchText { get; set; }
        public int searchType { get; set; }
    }

    public enum TYPEAHEAD_LIST{
        TYPEAHEAD_CUSTOMER=1,
        TYPEAHEAD_MATERIAL=2,


    }
}
