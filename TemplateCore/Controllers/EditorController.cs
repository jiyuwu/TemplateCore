using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Common;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyFilter;

namespace TemplateCore.Controllers
{
    [NoPermissionRequired]
    public class EditorController : Controller
    {
        #region MarkDown
        public IActionResult MarkDown()
        {
            Article article = new Article();
            article.Context = "这是编辑器测试数据！";
            article.Id = 1;
            article.Title = "测试";
            return View(article);
        }
        [HttpPost]
        public string UpladFilePIC(long? id)//id传过来，如需保存可以备用
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

        #endregion

        #region Kindeditor
        private string KindStr = "../../../files/UpFile/Kind";//前缀文件名，可自行修改
        public IActionResult Kindeditor()
        {
            Article article = new Article();
            article.Context = "这是编辑器测试数据！";
            article.Id = 1;
            article.Title = "测试";
            return View(article);
        }

        public async Task<IActionResult> KindSaveFiles(string dir, string Title, long ContextId = 0, long ArticleTypeId = 0)
        {
            if (Request.Form.Files.Count() == 0)
            {
                return showError("请选择上传的文件");
            }

            var file = Request.Form.Files[0];//kindeditor的上传文件控件，一次只传一个文件

            //定义允许上传的文件扩展名
            Hashtable extTable = new Hashtable();
            extTable.Add("image", "gif,jpg,jpeg,png,bmp");
            extTable.Add("flash", "swf,flv");
            extTable.Add("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb,mp4");
            extTable.Add("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");

            if (String.IsNullOrEmpty(dir))
            {
                dir = "image";
            }
            string fName = "";
            string fileName = "";
            string md5 = CommonHelper.CalcMD5(file.OpenReadStream());
            String fileExt = Path.GetExtension(file.FileName).ToLower();

            if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(((String)extTable[dir]).Split(','), fileExt.Substring(1).ToLower()) == -1)
            {
                return showError("上传文件扩展名是不允许的扩展名。\n只允许" + ((String)extTable[dir]) + "格式。");
            }

            //创建文件夹
            string dirPath = ConfigHelper.GetSectionValue("FileMap:FilePath") + "/"+ KindStr + "/" + dir + "/";
            string webPath = "/" + KindStr + "/" + dir + "/";
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            String ymd = DateTime.Now.ToString("yyyyMMdd", DateTimeFormatInfo.InvariantInfo);
            dirPath += ymd + "/";
            webPath += ymd + "/";
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            string suijishu = Math.Abs(Guid.NewGuid().GetHashCode()).ToString();
            String newFileName = DateTime.Now.ToString("yyyyMMddHHmmss_" + suijishu, DateTimeFormatInfo.InvariantInfo) + fileExt;

            fileName = dirPath + $@"{newFileName}";
            using (FileStream fs = System.IO.File.Create(fileName))
            {
                await file.CopyToAsync(fs);
                fs.Flush();
            }
            fName = ConfigHelper.GetSectionValue("FileMap:FileWeb") + webPath + newFileName;

            Hashtable hash = new Hashtable();
            hash["error"] = 0;
            hash["url"] = fName;
            return Json(hash);
        }

        [NonAction]
        private IActionResult showError(string message)
        {
            Hashtable hash = new Hashtable();
            hash["error"] = 1;
            hash["message"] = message;
            return Json(hash);
        }


        public IActionResult KindFileManager()
        {
            String rootUrl = "/"+ KindStr + "/";

            //图片扩展名
            String fileTypes = "gif,jpg,jpeg,png,bmp";

            String currentPath = "";
            String currentUrl = "";
            String currentDirPath = "";
            String moveupDirPath = "";

            String dirPath = ConfigHelper.GetSectionValue("FileMap:FilePath") + "/Kind" + "/";
            String dirName = Request.Query["dir"];
            if (!String.IsNullOrEmpty(dirName))
            {
                if (Array.IndexOf("image,flash,media,file".Split(','), dirName) == -1)
                {
                    return showError("目录错误");
                }
                dirPath += dirName + "/";
                rootUrl += dirName + "/";
                if (!Directory.Exists(dirPath))
                {
                    Directory.CreateDirectory(dirPath);
                }
            }

            //根据path参数，设置各路径和URL
            String path = Request.Query["path"];
            path = String.IsNullOrEmpty(path) ? "" : path;
            if (path == "")
            {
                currentPath = dirPath;
                currentUrl = rootUrl;
                currentDirPath = "";
                moveupDirPath = "";
            }
            else
            {
                currentPath = dirPath + path;
                currentUrl = rootUrl + path;
                currentDirPath = path;
                moveupDirPath = Regex.Replace(currentDirPath, @"(.*?)[^\/]+\/$", "$1");
            }

            //排序形式，name or size or type
            String order = Request.Query["order"];
            order = String.IsNullOrEmpty(order) ? "" : order.ToLower();

            //不允许使用..移动到上一级目录
            if (Regex.IsMatch(path, @"\.\."))
            {
                return showError("Access is not allowed.");
            }
            //最后一个字符不是/
            if (path != "" && !path.EndsWith("/"))
            {
                return showError("Parameter is not valid.");
            }
            //目录不存在或不是目录
            if (!Directory.Exists(currentPath))
            {
                return showError("Directory does not exist.");
            }

            //遍历目录取得文件信息
            string[] dirList = Directory.GetDirectories(currentPath);
            string[] fileList = Directory.GetFiles(currentPath);

            switch (order)
            {
                case "size":
                    Array.Sort(dirList, new NameSorter());
                    Array.Sort(fileList, new SizeSorter());
                    break;
                case "type":
                    Array.Sort(dirList, new NameSorter());
                    Array.Sort(fileList, new TypeSorter());
                    break;
                case "name":
                default:
                    Array.Sort(dirList, new NameSorter());
                    Array.Sort(fileList, new NameSorter());
                    break;
            }

            Hashtable result = new Hashtable();
            result["moveup_dir_path"] = moveupDirPath;
            result["current_dir_path"] = currentDirPath;
            result["current_url"] = currentUrl;
            result["total_count"] = dirList.Length + fileList.Length;
            List<Hashtable> dirFileList = new List<Hashtable>();
            result["file_list"] = dirFileList;
            for (int i = 0; i < dirList.Length; i++)
            {
                DirectoryInfo dir = new DirectoryInfo(dirList[i]);
                Hashtable hash = new Hashtable();
                hash["is_dir"] = true;
                hash["has_file"] = (dir.GetFileSystemInfos().Length > 0);
                hash["filesize"] = 0;
                hash["is_photo"] = false;
                hash["filetype"] = "";
                hash["filename"] = dir.Name;
                hash["datetime"] = dir.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss");
                dirFileList.Add(hash);
            }
            for (int i = 0; i < fileList.Length; i++)
            {
                FileInfo file = new FileInfo(fileList[i]);
                Hashtable hash = new Hashtable();
                hash["is_dir"] = false;
                hash["has_file"] = false;
                hash["filesize"] = file.Length;
                hash["is_photo"] = (Array.IndexOf(fileTypes.Split(','), file.Extension.Substring(1).ToLower()) >= 0);
                hash["filetype"] = file.Extension.Substring(1);
                hash["filename"] = file.Name;
                hash["datetime"] = file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss");
                dirFileList.Add(hash);
            }
            return Json(result);
        }


        public class NameSorter : IComparer
        {
            public int Compare(object x, object y)
            {
                if (x == null && y == null)
                {
                    return 0;
                }
                if (x == null)
                {
                    return -1;
                }
                if (y == null)
                {
                    return 1;
                }
                FileInfo xInfo = new FileInfo(x.ToString());
                FileInfo yInfo = new FileInfo(y.ToString());

                return xInfo.FullName.CompareTo(yInfo.FullName);
            }
        }

        public class SizeSorter : IComparer
        {
            public int Compare(object x, object y)
            {
                if (x == null && y == null)
                {
                    return 0;
                }
                if (x == null)
                {
                    return -1;
                }
                if (y == null)
                {
                    return 1;
                }
                FileInfo xInfo = new FileInfo(x.ToString());
                FileInfo yInfo = new FileInfo(y.ToString());

                return xInfo.Length.CompareTo(yInfo.Length);
            }
        }

        public class TypeSorter : IComparer
        {
            public int Compare(object x, object y)
            {
                if (x == null && y == null)
                {
                    return 0;
                }
                if (x == null)
                {
                    return -1;
                }
                if (y == null)
                {
                    return 1;
                }
                FileInfo xInfo = new FileInfo(x.ToString());
                FileInfo yInfo = new FileInfo(y.ToString());

                return xInfo.Extension.CompareTo(yInfo.Extension);
            }
        }
        #endregion
    }
}