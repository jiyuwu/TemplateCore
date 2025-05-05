using Common;
using DTO.PowerManager;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MyFilter;
using Service.DB;
using Service.Service.PowerManager;
using System.Collections.Generic;
using System;
using System.Data;
using System.Text.RegularExpressions;
using IService.PowerManager;
using IService.KanBan;
using DTO.KanBan;

namespace TemplateCore.Controllers
{
    [NoPermissionRequired]
    public class KanBanController : Controller
    {
        public HttpCommonHelper httpCommonHelper { get; set; }
        public IKBInfoService kbInfoService { get; set; }
        KBInfo kBInfo = new KBInfo();
        public KanBanController(IKBInfoService _kbInfoService, IHttpContextAccessor _accessor) {
            kbInfoService = _kbInfoService;
            httpCommonHelper = new HttpCommonHelper(_accessor);
        }


        #region 看板管理
        public IActionResult List(PageModel pageModel)
        {
            #region 节点权限控制 
            string token = httpCommonHelper.GetToken();
            var redis = new RedisHelper(1);
            User user = redis.StringGet<User>(token);
            List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
            ViewBag.Del = 0;
            ViewBag.Add = 0;
            ViewBag.Edit = 0;
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.看板管理.看板.查看)).Count <= 0)
            {
                return Redirect("../Home/NoPower");
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.看板管理.看板.删除)).Count > 0)
            {
                ViewBag.Del = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.看板管理.看板.添加)).Count > 0)
            {
                ViewBag.Add = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.看板管理.看板.编辑)).Count > 0)
            {
                ViewBag.Edit = 1;
            }
            #endregion
            pageModel.TitleName = Common.CommonHelper.IsNullOrWhiteSpaceChange(pageModel.TitleName);
            pageModel.NumCount = pageModel.NumCount == 0 ? 10 : pageModel.NumCount;
            pageModel.CurrentPage = pageModel.CurrentPage == 0 ? 1 : pageModel.CurrentPage;
            ViewBag.PageModel = pageModel;
            List<KBInfo> list = kbInfoService.GetList(pageModel);
            int allCount = (int)kbInfoService.GetCount(pageModel);
            ViewBag.AllCount = allCount;
            string NewShowPager = string.Format("List?CurrentPage=|pageIndex|&NumCount={0}", pageModel.NumCount);
            if (!string.IsNullOrWhiteSpace(pageModel.TitleName))
            {
                NewShowPager = NewShowPager + "&TitleName=" + pageModel.TitleName;
            }
            ViewBag.Page = CommonHelper.Pager(NewShowPager, pageModel.CurrentPage, allCount, pageModel.NumCount);
            return View(list);
        }
        public IActionResult AddOrEdit()
        {
            IQueryCollection queryParameters = HttpContext.Request.Query;
            long Id = Convert.ToInt64(queryParameters["Id"]);
            ViewBag.Id = Id;
            KBInfo info = kbInfoService.GetInfoById(Id);
            if (info == null)
            {
                info = new KBInfo();
                info.Title = "";
                info.Description = "";
                info.Refreshtime = 30;
            }
            ViewBag.KBInfo = info;
            return View();
        }
        [HttpPost]
        public IActionResult Save(KBInfo info)
        {
            bool b = false;
            if (info.Id > 0)
            {
                long x = kbInfoService.Updata(info);
                if (x > 0)
                    b = true;
            }
            else
            {
                long x = kbInfoService.AddNew(info);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/UserSave");
        }
        [HttpPost]
        public IActionResult KanBanDelete(ChangeState changeState)
        {
            bool b = false;
            if (changeState.Id > 0)
            {
                long x = kbInfoService.Delete(changeState);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/UserChangeStute");
        }
        #endregion
        public IActionResult Edit()
        {
            return View();
        }
        [EnableCors("AllowAnyOrigin")]
        public string GetJsonBySql(string sql)
        {
            if (!string.IsNullOrEmpty(sql))//postgresql会自动转小写，推荐建表直接使用小写或改配置
            {
                sql = QuoteTableNames(sql);
                //sql=sql.Replace("IsRead", "\"IsRead\"").Replace("SentDate", "\"SentDate\"");
            }
            DataTable dataTable = SqlHelper.GetTable(sql, CommandType.Text);
            string jsonResult = CommonHelper.GetJsonResult(200, "成功", Newtonsoft.Json.JsonConvert.SerializeObject((dataTable)));
            return jsonResult;
        }
        public string QuoteTableNames(string sqlQuery)
        {
            // 使用正则表达式替换 SQL 查询语句中的表名，将表名用双引号括起来
            return Regex.Replace(sqlQuery, @"(?<=(?:FROM|JOIN)\s+)(\w+)", match =>
            {
                string tableName = match.Value;
                return "\"" + tableName + "\"";
            }, RegexOptions.IgnoreCase);
        }
    }
}
