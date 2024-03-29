﻿using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyFilter;

namespace TemplateCore.Controllers
{
    public class HomeController : Controller
    {
        public IUserService userService { get; set; }
        public IRole_MenuService role_MenuService { get; set; }
        public HttpCommonHelper httpCommonHelper { get; set; }
        public IConfiguration Configuration;
        public HomeController(IUserService _userService, IRole_MenuService _role_MenuService, IHttpContextAccessor _accessor)
        {
            userService = _userService;
            role_MenuService = _role_MenuService;
            httpCommonHelper = new HttpCommonHelper(_accessor);
        }
        public IActionResult Index()
        {
            string token = httpCommonHelper.GetToken();
            var redis = new RedisHelper(1);
            User user = redis.StringGet<User>(token);
            List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
            if (role_Menus == null)
            {
                role_Menus = role_MenuService.GetMenuListByRoleId(user.RoleId);
                #region 保存用户拥有的权限
                var exp = new TimeSpan(2, 0, 0);//设置过期时间为2h
                redis.StringSet(token + "_Power", role_Menus, exp);
                #endregion
            }

            List<Role_Menu> menus = role_Menus.FindAll(e => e.Menu.ParentId == 0);
            StringBuilder sb = new StringBuilder();
            foreach (Role_Menu role_Menu in menus)
            {
                //sb.AppendFormat("<a href='javascript:;'><i class='iconfont'>&#xe726;</i><cite>{0}</cite><i class='iconfont nav_right'>&#xe697;</i></a>", role_Menu.Menu.Name);
                //List<Role_Menu> menusUrl = role_Menus.FindAll(e => e.Menu.ParentId == role_Menu.MenuId);
                //foreach (Role_Menu menu in menusUrl)
                //{
                //    sb.AppendFormat("<ul class='sub-menu'><li><a _href='{0}'><i class='iconfont'>&#xe6a7;</i><cite>{1}</cite></a></li></ul>", menu.Menu.UrlOrClass, menu.Menu.Name);
                //}
                sb.AppendFormat("<li><a href='javascript:;'><i class='iconfont'>&#xe6b4;</i><cite>{0}</cite><i class='iconfont nav_right'>&#xe697;</i></a>", role_Menu.Menu.Name);
                List<Role_Menu> menusUrl = role_Menus.FindAll(e => e.Menu.ParentId == role_Menu.MenuId);
                foreach (Role_Menu menu in menusUrl)
                {
                    sb.AppendFormat("<ul class='sub-menu'><li><a _href='{0}'><i class='iconfont'>&#xe6a7;</i><cite>{1}</cite></a></li></ul>", menu.Menu.UrlOrClass, menu.Menu.Name);
                }
                sb.Append("</li>");
            }
            ViewBag.Menu = sb.ToString();
            return View();
        }

        #region 无权限
        [NoPermissionRequiredAttribute]
        public IActionResult NoPower()
        {
            return View();
        }
        #endregion

        #region 登录
        [NoPermissionRequiredAttribute]
        public IActionResult Login()
        {
            return View();
        }
        [NoPermissionRequiredAttribute]
        public async Task<IActionResult> LoginOutAsync(string token)
        {
            var redis = new RedisHelper(1);
            await redis.KeyDeleteAsync(token);
            return Redirect("Index");
        }

        [HttpPost]
        [NoPermissionRequiredAttribute]
        public async Task<string> ToLoginAsync()
        {
            IFormCollection form = HttpContext.Request.Form;
            string code = form["Code"];
            string uuid = form["UUID"];
            string username = form["UserName"];
            string password = form["Password"];
            var redis = new RedisHelper(1);
            string jsonResult = "[]";
            if (redis.StringGet(uuid) == null)
            {
                return CommonHelper.NewGetJsonResult(-2, "验证码已过期");
            }

            if ((code.ToLower()).Equals(redis.StringGet(uuid).ToLower()))
            {
                User user = await userService.GetUserListByPasswordAsync(username, password);
                if (user == null)
                {
                    jsonResult = CommonHelper.NewGetJsonResult(-1, "用户名或密码错误");
                }
                else
                {
                    await redis.KeyDeleteAsync(uuid);
                    var exp = new TimeSpan(2, 0, 0);//设置过期时间为2h
                    string token = Guid.NewGuid().ToString();
                    List<Role_Menu> role_Menus = role_MenuService.GetMenuListByRoleId(user.RoleId);
                    await redis.StringSetAsync(token, user, exp);
                    await redis.StringSetAsync(token + "_Power", role_Menus, exp);
                    jsonResult = CommonHelper.NewGetJsonResult(1, token, new { user });
                }
            }
            else
            {
                jsonResult = CommonHelper.NewGetJsonResult(-2, "验证码错误");
            }
            return jsonResult;
        }
        #endregion

        #region 验证码
        /// <summary>
        /// 混合验证码
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [NoPermissionRequiredAttribute]
        public string MixVerifyCode()
        {
            #region 数字验证码
            //string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.AbcVerifyCode);
            //var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            //MemoryStream stream = new MemoryStream();
            //bitmap.Save(stream, ImageFormat.Png);
            //return File(stream.ToArray(), "image/png");
            #endregion
            #region 字母验证码
            //string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.AbcVerifyCode);
            //var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            //MemoryStream stream = new MemoryStream();
            //bitmap.Save(stream, ImageFormat.Png);
            //return File(stream.ToArray(), "image/png");
            #endregion
            string code = VerifyCodeHelper.GetSingleObj().CreateVerifyCode(VerifyCodeHelper.VerifyCodeType.MixVerifyCode);
            var bitmap = VerifyCodeHelper.GetSingleObj().CreateBitmapByImgVerifyCode(code, 100, 40);
            byte[] imgBt = CommonHelper.Bitmap2Byte(bitmap);
            string uuid = Guid.NewGuid().ToString();
            var redis = new RedisHelper(1);
            var exp = new TimeSpan(60 * 20000000);//设置过期时间为120s
            redis.StringSet(uuid, code, exp);
            return CommonHelper.NewGetJsonResult(1, Convert.ToBase64String(imgBt),new { uuid, code });
                //CommonHelper.CodeJson(uuid, Convert.ToBase64String(imgBt));
        }
        #endregion
        [NoPermissionRequiredAttribute]
        public IActionResult IndexPage()
        {
            return View();
        }

        #region 配置读取 settings read
        [NoPermissionRequiredAttribute]
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
        [NoPermissionRequiredAttribute]
        public string TestConfig()
        {
            string ImgPath = ConfigHelper.GetSectionValue("FileMap:ImgPath");
            return ImgPath;
        }
        #endregion

        #region json相关
        [NoPermissionRequiredAttribute]
        public IActionResult Json()
        {
            List<Article> articleList = new List<Article>();
            for (int x = 0; x < 100000; x++)
            {
                Article article = new Article();
                article.Context = "内容：" + x;
                article.Id = x + 1;
                article.CreateTime = DateTime.Now;
                article.Title = "标题：" + x;
                articleList.Add(article);
            }

            #region 单个对象与json互转
            Article articletest = new Article();
            articletest.Context = "内容";
            articletest.Id = 1;
            articletest.CreateTime = DateTime.Now;
            articletest.Title = "标题";
            string json11 = CommonHelper.SerializeDataContractJson(articletest);
            string json12 = CommonHelper.SerializeJSON(articletest);
            Article article1 = CommonHelper.DeserializeDataContractJson<Article>(json11);
            Article article2 = CommonHelper.DeserializeJSON<Article>(json12);
            #endregion

            #region 记录10万对象集合与json互转用时比较
            //SerializeDataContractJson 10万对象转json
            System.Diagnostics.Stopwatch watch1 = new System.Diagnostics.Stopwatch();
            watch1.Start();  //开始监视代码运行时间
            string json1 = CommonHelper.SerializeDataContractJson(articleList); 
            TimeSpan timespan1 = watch1.Elapsed;  //获取当前实例测量得出的总时间
            watch1.Stop();  //停止监视   
            ViewBag.t1= timespan1.TotalSeconds;

            //Newtonsoft 10万对象转json
            System.Diagnostics.Stopwatch watch2 = new System.Diagnostics.Stopwatch();
            watch2.Start();  
            string json2 = CommonHelper.SerializeJSON(articleList);
            TimeSpan timespan2 = watch2.Elapsed;  
            watch2.Stop();
            ViewBag.t2 = timespan2.TotalSeconds;

            //SerializeDataContractJson 10万json转对象
            System.Diagnostics.Stopwatch watch3 = new System.Diagnostics.Stopwatch();
            watch3.Start();  
            List<Article> list1 = CommonHelper.DeserializeDataContractJson<List<Article>>(json1);
            TimeSpan timespan3 = watch3.Elapsed; 
            watch3.Stop();   
            ViewBag.t3 = timespan3.TotalSeconds;

            //Newtonsoft 10万json转对象
            System.Diagnostics.Stopwatch watch4 = new System.Diagnostics.Stopwatch();
            watch4.Start();  
            List<Article> list2 = CommonHelper.DeserializeJSON<List<Article>>(json2);
            TimeSpan timespan4 = watch4.Elapsed;  
            watch4.Stop();   
            ViewBag.t4 = timespan4.TotalSeconds;

            #endregion

            #region 记录10万datatable与json互转用时比较
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
            for (int x = 0; x < 100000; x++)
            {
                DataRow newRow = tblDatas.NewRow();
                newRow["Product"] = "西游记" + x;
                newRow["Version"] = "" + x;
                newRow["Description"] = x;
                tblDatas.Rows.Add(newRow);
            }

            //Newtonsoft 10万DataTable转json
            System.Diagnostics.Stopwatch watch5 = new System.Diagnostics.Stopwatch();
            watch5.Start();  
            string json5 = CommonHelper.SerializeDataTableToJSON(tblDatas);
            TimeSpan timespan5 = watch5.Elapsed;  
            watch5.Stop(); 
            ViewBag.t5 = timespan5.TotalSeconds;

            //Newtonsoft 10万json转DataTable
            System.Diagnostics.Stopwatch watch6 = new System.Diagnostics.Stopwatch();
            watch6.Start();  
            DataTable dataTable = CommonHelper.SerializeJSONToDataTable(json5);
            TimeSpan timespan6 = watch6.Elapsed; 
            watch6.Stop();  
            ViewBag.t6 = timespan6.TotalSeconds;

            //自己写的  10万DataTable转json
            System.Diagnostics.Stopwatch watch7 = new System.Diagnostics.Stopwatch();
            watch7.Start();  
            string json7 = CommonHelper.MyDataTableToJson(tblDatas);
            TimeSpan timespan7 = watch7.Elapsed; 
            watch7.Stop();    
            ViewBag.t7 = timespan7.TotalSeconds;
            #endregion


            return View();
        }
        #endregion

        #region websocket案例
        [NoPermissionRequiredAttribute]
        public IActionResult WebSoketTest()
        {
            return View();
        }
        #endregion


        #region 容器ip
        // GET Home/GetIp
        [HttpGet]
        [NoPermissionRequiredAttribute]
        public ActionResult<string> GetIp()
        {
            var ip = this.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (string.IsNullOrEmpty(ip))
            {
                ip = this.Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
            return ip;
        }
        #endregion

    }
}