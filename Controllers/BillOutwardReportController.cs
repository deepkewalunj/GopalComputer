using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Bill;
using Gopal.Services.Bill;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Route("api/BillOutwardReport")]
    [ApiController]
    public class BillOutwardReportController : ControllerBase
    {
        IBillOutwardReportService _reportServices;
        public BillOutwardReportController(IBillOutwardReportService reportServices) {
            _reportServices= reportServices;
        }
        [HttpPost("GetBillReportList")]
        [Authorize]
        public IActionResult GetBillReportList(BillOutwardReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetBillReportList(searchModel));
        }

        [HttpPost("GetOutwardReportList")]
        [Authorize]
        public IActionResult GetOutwardReportList(BillOutwardReportSearchModel searchModel)
        {
            return Ok(_reportServices.GetOutwardReportList(searchModel));
        }
    }
}