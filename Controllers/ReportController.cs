using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Report;
using Gopal.Services.Bill;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Route("api/Report")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        IReportServices _reportServices;
        public ReportController(IReportServices reportServices) {
            _reportServices= reportServices;
        }
        [HttpPost("GetBillReportList")]
        [Authorize]
        public IActionResult GetBillReportList(ReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetBillReportList(searchModel));
        }

        [HttpPost("GetOutwardReportList")]
        [Authorize]
        public IActionResult GetOutwardReportList(ReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetOutwardReportList(searchModel));
        }

        [HttpPost("GetInwardReportList")]
        [Authorize]
        public IActionResult GetInwardReportList(ReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetInwardReportList(searchModel));
        }

        [HttpGet("GetClientOutstandingReportList")]
        [Authorize]
        public IActionResult GetClientOutstandingReportList()
        {
            return Ok(_reportServices.GetClientOutstandingReportList());
        }

        [HttpPost("GetAccountStatementReport")]
        [Authorize]
        public IActionResult GetAccountStatementReport(ReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetAccountStatementReport(searchModel));
        }

        [HttpPost("SendClientOutstandingSMS")]
        [Authorize]
        public IActionResult SendClientOutstandingSMS(List<ClientOutstandingSMSModel> lstClientOutstandingSMSModel)
        {

            return Ok();
        }

    }
}