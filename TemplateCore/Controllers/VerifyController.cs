using System;
using System.Collections.Generic;
using System.DrawingCore.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common;
using Microsoft.AspNetCore.Mvc;
using MyFilter;

namespace TemplateCore.Controllers
{
    [NoPermissionRequiredAttribute]
    public class VerifyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        #region 验证码

        #region 混合验证码

        [HttpGet]
        public string MixVerifyCodeJson()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.MixVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            byte[] imgBt = CommonHelper.Bitmap2Byte(bitmap);
            string uuid = Guid.NewGuid().ToString();
            return CommonHelper.CodeJson(uuid, Convert.ToBase64String(imgBt));
        }
        [HttpGet]
        public IActionResult MixVerifyCode()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.MixVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            MemoryStream stream = new MemoryStream();
            bitmap.Save(stream, ImageFormat.Png);
            return File(stream.ToArray(), "image/png");
        }
        #endregion

        #region 数字验证码
        [HttpGet]
        public string NumberVerifyCodeJson()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.NumberVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            byte[] imgBt = CommonHelper.Bitmap2Byte(bitmap);
            string uuid = Guid.NewGuid().ToString();
            return CommonHelper.CodeJson(uuid, Convert.ToBase64String(imgBt));
        }
        [HttpGet]
        public IActionResult NumberVerifyCode()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.NumberVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            MemoryStream stream = new MemoryStream();
            bitmap.Save(stream, ImageFormat.Png);
            return File(stream.ToArray(), "image/png");
        }
        #endregion

        #region 字母验证码
        [HttpGet]
        public IActionResult AbcVerifyCode()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.AbcVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            MemoryStream stream = new MemoryStream();
            bitmap.Save(stream, ImageFormat.Png);
            return File(stream.ToArray(), "image/png");
        }
        [HttpGet]
        public string AbcVerifyCodeJson()
        {
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.AbcVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            byte[] imgBt = CommonHelper.Bitmap2Byte(bitmap);
            string uuid = Guid.NewGuid().ToString();
            return CommonHelper.CodeJson(uuid, Convert.ToBase64String(imgBt));
        }
        #endregion

        #endregion
    }
}