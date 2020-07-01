using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gopal.EntityFrameworkCore;
using Gopal.Models.MaterialType;
using Gopal.Services.MaterialType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Gopal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialTypeController : ControllerBase
    {
        private IConfiguration _config;
        private readonly IMaterialTypeServices _services;

        public MaterialTypeController(IMaterialTypeServices services, IConfiguration config)
        {
            _services = services;
            _config = config;
        }

        [HttpGet("[action]")]
        [Authorize]
        public IActionResult GetSearchModelNoMaterialTypeCompanyNames()
        {
            return Ok(new { materialTypeDetails = _services.GetSearchModelNoMaterialTypeCompanyNames() });
        }

        [HttpPut("[action]")]
        [Authorize]
        public IActionResult GetSearchModelNoMaterialTypeCompanyNameById(tblSearchModelNoMaterialTypeCompanyNameInputModel model)
        {
            return Ok(new { materialTypeDetail = _services.GetSearchModelNoMaterialTypeCompanyNameById((int)model.searchId)});
        }

        [HttpPost("[action]")]
        [Authorize]
        public IActionResult SaveSearchModelNoMaterialTypeCompanyNameData(tblSearchModelNoMaterialTypeCompanyNameInputModel model)
        {

            return Ok(new { materialTypeDetail = _services.SaveSearchModelNoMaterialTypeCompanyNameData(model) });
        }

        [HttpGet]
        [Route("DeleteSearchModelNoMaterialTypeCompanyName")]
        public ActionResult DeleteSearchModelNoMaterialTypeCompanyName(int searchId)
        {
            return Ok(_services.DeleteSearchModelNoMaterialTypeCompanyName(searchId));
        }
    }
}
