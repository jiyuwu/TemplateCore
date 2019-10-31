using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TemplateCore.Controllers
{
    public class EditorController : Controller
    {
        public IActionResult MarkDown()
        {
            Article article = new Article();
            article.Context = "这是编辑器测试数据！";
            article.Id = 1;
            article.Title = "测试";
            return View(article);
        }
        [HttpPost]
        public  string UpladFilePIC(long? id)//id传过来，如需保存可以备用
        {
            IFormCollection fc = HttpContext.Request.Form;
            string savePath = string.Empty;
            int code = 0;
            string msg = "";
            string base64 = fc["base"];
            if (base64 != null)
            {
                string[] spl = base64.Split(',');
                string getImgFormat = spl[0].Split(':')[1].Split('/')[1].Split(';')[0];
                byte[] arr2 = Convert.FromBase64String(spl[1]);
                //上传到服务器
                DateTime today = DateTime.Today;
                string md5 = CommonHelper.CalcMD5(spl[1]);
                string upFileName = md5 + "." + getImgFormat;//生成随机文件名（ System.Guid.NewGuid().ToString() ）
                var pathStart = ConfigHelper.GetSectionValue("FileMap:ImgPath") + DateTime.Now.Year + "/" + DateTime.Now.Month + "/";
                if (System.IO.Directory.Exists(pathStart) == false)//如果不存在新建
                {
                    System.IO.Directory.CreateDirectory(pathStart);
                }
                var filePath = pathStart + upFileName;
                string pathNew = ConfigHelper.GetSectionValue("FileMap:ImgWeb") + filePath.Replace(ConfigHelper.GetSectionValue("FileMap:ImgPath"), "");
                using (MemoryStream memoryStream = new MemoryStream(arr2, 0, arr2.Length))
                {
                    memoryStream.Write(arr2, 0, arr2.Length);
                    System.DrawingCore.Image image = System.DrawingCore.Image.FromStream(memoryStream);//  转成图片
                    image.Save(filePath);  // 将图片存到本地 
                    code = 1;
                    msg = pathNew;
                }
            }
            string jsonResult = CommonHelper.GetJsonResult(code, msg);
            return jsonResult;
        }

        public JsonResult UpImage(long? id)//id传过来，如需保存可以备用
        {
            int success = 0;
            string msg = "";
            string pathNew = "";
            try
            {
                var date = Request;
                var files = Request.Form.Files;
                foreach (var formFile in files)
                {
                    if (formFile.Length > 0)
                    {
                        string fileExt = formFile.FileName.Substring(formFile.FileName.LastIndexOf(".") + 1, (formFile.FileName.Length - formFile.FileName.LastIndexOf(".") - 1)); //扩展名
                        long fileSize = formFile.Length; //获得文件大小，以字节为单位
                        string md5 = CommonHelper.CalcMD5(formFile.OpenReadStream());
                        string newFileName = md5 + "." + fileExt; //MD5加密生成文件名保证文件不会重复上传
                        var pathStart = ConfigHelper.GetSectionValue("FileMap:ImgPath") + DateTime.Now.Year + "/" + DateTime.Now.Month + "/";
                        if (System.IO.Directory.Exists(pathStart) == false)//如果不存在新建
                        {
                            System.IO.Directory.CreateDirectory(pathStart);
                        }
                        var filePath = pathStart + newFileName;
                        pathNew = ConfigHelper.GetSectionValue("FileMap:ImgWeb") + filePath.Replace(ConfigHelper.GetSectionValue("FileMap:ImgPath"), "");
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {

                            formFile.CopyTo(stream);
                            success = 1;
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                success = 0;
                msg = ex.ToString();
            }
            var obj = new { success = success, url = pathNew, message = msg };
            return Json(obj);
        }
    }
}