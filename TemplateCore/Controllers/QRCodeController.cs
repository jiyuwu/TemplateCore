using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace TemplateCore.Controllers
{
    public class QRCodeController : Controller
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        //private readonly IHostingEnvironment _hostingEnvironment; 3.0之前使用它
        public QRCodeController(IWebHostEnvironment _webHostEnvironment)
        {
            webHostEnvironment=_webHostEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult GetPTQRCode(string url, int pixel=5)
        {
            url = HttpUtility.UrlDecode(url);
            Response.ContentType = "image/jpeg";

            var bitmap = QRCoderHelper.GetPTQRCode(url, pixel);
            MemoryStream ms = new MemoryStream();
            bitmap.Save(ms, ImageFormat.Jpeg);
            return File(ms.ToArray(), "image/png");
        }
        public IActionResult GetLogoQRCode(string url,string logoPath, int pixel = 5)
        {
            url = HttpUtility.UrlDecode(url);
            logoPath= webHostEnvironment.WebRootPath + HttpUtility.UrlDecode(logoPath);
            Response.ContentType = "image/jpeg";

            var bitmap = QRCoderHelper.GetLogoQRCode(url, logoPath, pixel);
            MemoryStream ms = new MemoryStream();
            bitmap.Save(ms, ImageFormat.Jpeg);
            return File(ms.ToArray(), "image/png");
        }
    }
}