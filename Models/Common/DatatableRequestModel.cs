using System.Collections.Generic;

public class Columns
{
    public string data { get; set; }
    public string name { get; set; }
    public bool searchable { get; set; }
    public bool orderable { get; set; }
    public Search search { get; set; }

}
public class Order
{
    public int column { get; set; }
    public string dir { get; set; }

}
public class Search
{
    public string value { get; set; }
    public bool regex { get; set; }

}
public class DatatableRequestModel
{
    public int draw { get; set; }
    public List<Columns> columns { get; set; }
    public List<Order> order { get; set; }
    public int start { get; set; }
    public int length { get; set; }
    public Search search { get; set; }

}
public class DatatableRequestWrapper
{
    public DatatableRequestModel getListModel { get; set; }

}

public class InwardCustomSearch
{
    public string companyName { get; set; }
    public string modelNo { get; set; }
    public string jobStatus { get; set; }
    public string billStatus { get; set; }
    public string inwardDate { get; set; }
    public string materialType { get; set; }
    public string materialCompanyName { get; set; }
    public string serialNo { get; set; }
    public string problemDescription { get; set; }
    public string enggName { get; set; }
}