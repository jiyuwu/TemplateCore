using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace TemplateCore.Controllers
{
    public class HomeController : Controller
    {
        public IConfiguration Configuration;
        public IActionResult Index()
        {
            return View();
        }
        #region 配置读取 settings read
        public string TestAppSettings()
        {
            string sqlString = AppSettingsHelper.Configuration.GetConnectionString("TestConnection");
            string sqlString1 = AppSettingsHelper.Configuration["Logging:LogLevel:Default"];
            var builder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            Configuration = builder.Build();
            string sqlString2 = Configuration["Logging:LogLevel:Default"];
            return sqlString + sqlString1 + sqlString2;
        }

        public string TestConfig()
        {
            string ImgPath = ConfigHelper.GetSectionValue("FileMap:ImgPath");
            return ImgPath;
        }
        #endregion



    }
}