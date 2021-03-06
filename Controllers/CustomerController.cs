﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.EntityFrameworkCore;
using Gopal.Models.Common;
using Gopal.Models.Customer;
using Gopal.Services.Customer;
using Gopal.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gopal.Controllers
{
    [Authorize]
    [Route("api/Customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerServices _customerServices;

       

        public CustomerController(ICustomerServices customerServices) {
            _customerServices = customerServices;
            
        }

      
        [HttpPost]
        [Route("GetCustomerList")]
        public ActionResult GetCustomerList(DatatableRequestWrapper requestObjectWrapper) {
           
            return Ok(_customerServices.GetCustomerList(requestObjectWrapper.getListModel)); 
        }

        [HttpPost]
        [Route("AddEditCustomer")]
        public ActionResult AddEditCustomer(CustomerModel customer)
        {
            CustomerModel returnCustomer = _customerServices.AddEditCustomer(customer, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(returnCustomer);
        }

        [HttpGet]
        [Route("DeleteCustomer")]
        public ActionResult DeleteCustomer(int customerId) {
            int returnCustomerId = _customerServices.DeleteCustomer(customerId, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
              return Ok(returnCustomerId);
        }
    }
}