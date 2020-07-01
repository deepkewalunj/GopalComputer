using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.Models.Accessory;
using Gopal.Services.Accessory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Gopal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessoryController : ControllerBase
    {
        private IConfiguration _config;
        private readonly IAccessoryServices _services;

        public AccessoryController(IAccessoryServices services, IConfiguration config)
        {
            _services = services;
            _config = config;
        }

        [HttpGet("[action]")]
        [Authorize]
        public IActionResult getAccessories()
        {
            return Ok(new { materialAccessoriesList = _services.getAccessories() });
        }

        [HttpGet("[action]")]
        [Authorize]
        public IActionResult getAccessoryById(int accessoryId)
        {
            return Ok(new { accessory = _services.getAccessoryById(accessoryId) });
        }

        [HttpPost("[action]")]
        [Authorize]
        public IActionResult saveAccessory(AccessoryInputModel model)
        {

            return Ok(new { result = _services.saveAccessory(model) });
        }

        [HttpDelete]
        [Route("deleteAccessory")]
        public ActionResult deleteAccessory(int accessoryId)
        {
            return Ok(new { result = _services.deleteAccessory(accessoryId) });
        }
    }
}
