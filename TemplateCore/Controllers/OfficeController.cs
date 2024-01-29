using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyFilter;

namespace TemplateCore.Controllers
{
    [NoPermissionRequiredAttribute]
    public class OfficeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        #region EPPlus导出Excel
        public string DTExportEPPlusExcel()
        {
            string code = "fail";
            DataTable tblDatas = new DataTable("Datas");
            DataColumn dc = null;
            dc = tblDatas.Columns.Add("ID", Type.GetType("System.Int32"));
            dc.AutoIncrement = true;//自动增加
            dc.AutoIncrementSeed = 1;//起始为1
            dc.AutoIncrementStep = 1;//步长为1
            dc.AllowDBNull = false;//

            dc = tblDatas.Columns.Add("Product", Type.GetType("System.String"));
            dc = tblDatas.Columns.Add("Version", Type.GetType("System.String"));
            dc = tblDatas.Columns.Add("Description", Type.GetType("System.String"));

            DataRow newRow;
            newRow = tblDatas.NewRow();
            newRow["Product"] = "大话西游";
            newRow["Version"] = "2.0";
            newRow["Description"] = "我很喜欢";
            tblDatas.Rows.Add(newRow);

            newRow = tblDatas.NewRow();
            newRow["Product"] = "梦幻西游";
            newRow["Version"] = "3.0";
            newRow["Description"] = "比大话更幼稚";
            tblDatas.Rows.Add(newRow);

            newRow = tblDatas.NewRow();
            newRow["Product"] = "西游记";
            newRow["Version"] = null;
            newRow["Description"] = "";
            tblDatas.Rows.Add(newRow);

            for (int x = 0; x < 100000; x++)
            {
                newRow = tblDatas.NewRow();
                newRow["Product"] = "西游记"+x;
                newRow["Version"] = ""+x;
                newRow["Description"] = x;
                tblDatas.Rows.Add(newRow);
            }
            string fileName = "MyExcel.xlsx";
            string[] nameStrs = new string[tblDatas.Rows.Count];//每列名，这里不赋值则表示取默认
            string savePath = "wwwroot/Excel";//相对路径
            string msg = "Excel/"+ fileName;//文件返回地址，出错就返回错误信息。
            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();  //开始监视代码运行时间
            bool b = OfficeHelper.DTExportEPPlusExcel(tblDatas, savePath, fileName, nameStrs, ref msg) ;
            TimeSpan timespan = watch.Elapsed;  //获取当前实例测量得出的总时间
            watch.Stop();  //停止监视
            if (b)
            {
                code = "success";
            }
            return "{\"code\":\"" + code + "\",\"msg\":\"" + msg + "\",\"timeSeconds\":\"" + timespan.TotalSeconds + "\"}";
        }
        public string ModelExportEPPlusExcel()
        {
            string code = "fail";
            List<Article> articleList = new List<Article>();
            for (int x = 0; x < 100000; x++)
            {
                Article article = new Article();
                article.Context = "内容："+x;
                article.Id = x + 1;
                article.CreateTime = DateTime.Now;
                article.Title = "标题：" + x;
                articleList.Add(article);
            }
            string fileName = "MyModelExcel.xlsx";
            string[] nameStrs = new string[4] {"Id", "Title", "Context", "CreateTime" };//按照模型先后顺序，赋值需要的名称
            string savePath = "wwwroot/Excel";//相对路径
            string msg = "Excel/" + fileName;//文件返回地址，出错就返回错误信息。
            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();  //开始监视代码运行时间
            bool b = OfficeHelper.ModelExportEPPlusExcel(articleList, savePath, fileName, nameStrs, ref msg);
            TimeSpan timespan = watch.Elapsed;  //获取当前实例测量得出的总时间
            watch.Stop();  //停止监视
            if (b)
            {
                code = "success";
            }
            return "{\"code\":\"" + code + "\",\"msg\":\"" + msg + "\",\"timeSeconds\":\"" + timespan.TotalSeconds + "\"}";
        }
        #endregion

        #region EPPlus导入数据
        public async Task<string> ExcelImportEPPlusDTJsonAsync() {
            IFormFileCollection files = Request.Form.Files;
            DataTable articles = new DataTable();
            int code = 0;
            string msg = "失败！";
            var file = files[0];
            string dirfile = ConfigHelper.GetSectionValue("FileMap:FilePath");
            if (!Directory.Exists(dirfile))
            {
                Directory.CreateDirectory(dirfile);
            }
            string path = dirfile + files[0].FileName;
            using (FileStream fs = System.IO.File.Create(path))
            {
                await file.CopyToAsync(fs);
                fs.Flush();
            }
            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();  //开始监视代码运行时间
            FileInfo fileExcel = new FileInfo(path);
            articles = OfficeHelper.InputEPPlusByExcelToDT(fileExcel);
            TimeSpan timespan = watch.Elapsed;  //获取当前实例测量得出的总时间
            watch.Stop();  //停止监视
            code = 1; msg = "成功！";
            string json = CommonHelper.GetJsonResult(code, msg, new { articles, timespan });
            return json;
        }

        public async Task<string> ExcelImportEPPlusModelJsonAsync()
        {
            IFormFileCollection files = Request.Form.Files;
            List<Article> articles = new List<Article>();
            int code = 0;
            string msg = "失败！";
            var file = files[0];
            string dirfile = ConfigHelper.GetSectionValue("FileMap:FilePath");
            if (!Directory.Exists(dirfile))
            {
                Directory.CreateDirectory(dirfile);
            }
            string path = dirfile + files[0].FileName;
            using (FileStream fs = System.IO.File.Create(path))
            {
                await file.CopyToAsync(fs);
                fs.Flush();
            }
            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();  //开始监视代码运行时间
            FileInfo fileExcel = new FileInfo(path);
            articles=OfficeHelper.LoadFromExcel<Article>(fileExcel).ToList();
            TimeSpan timespan = watch.Elapsed;  //获取当前实例测量得出的总时间
            watch.Stop();  //停止监视
            code = 1;msg = "成功！";
            string json = CommonHelper.GetJsonResult(code, msg, new { articles, timespan });
            return json;
        }
        #endregion
    }
}