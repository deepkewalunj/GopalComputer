using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Route("api/Customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerServices _customerServices;


        public CustomerController(ICustomerServices customerServices) {
            _customerServices = customerServices;
        }

        [AllowAnonymous]
        [HttpPost()]
        [Route("GetCustomerList")]
        public ActionResult GetCustomerList(Application application) {
           
            return Ok(_customerServices.GetCustomerList(application.getCustomerListModel)); 
        }
    }
}