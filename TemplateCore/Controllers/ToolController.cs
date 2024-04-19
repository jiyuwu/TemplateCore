using Common;
using DTO;
using Microsoft.AspNetCore.Mvc;
using MyFilter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TemplateCore.Controllers
{
    [NoPermissionRequired]
    public class ToolController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult MakePassword()
        {
            return View();
        }
        public string MakePass(Password pass)
        {
            int code = 0;
            string password = "一个也不选，你小子玩我呢？(What’s your problem?)";
            StringBuilder s = new StringBuilder();
            if (pass.num)
                s.Append("1234567890");
            if (pass.strLower)
                s.Append("abcdefghijklmnopqrstuvwxyz");
            if (pass.strUpper)
                s.Append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            if (pass.other)
                s.Append("!@#$%^&*");
            if (s.Length >0)
            {
                password = CommonHelper.MakePassword(pass.count, s.ToString());
            }
            if (!string.IsNullOrWhiteSpace(password))
                code = 1;
            return CommonHelper.GetJsonResult(code, password);
        }
        public IActionResult HtmlToText()
        {
            return View();
        }
        [HttpPost]
        public string HtmlConvertText(string str)
        {
            int code = 0;
            TextHelper textHelper = new TextHelper();
            if (!string.IsNullOrWhiteSpace(str))
            {
                code = 1;
                str = textHelper.Convert(str);
            }
            else { str = "失败！"; }
            return CommonHelper.GetJsonResult(code, str);
        }
    }
}
