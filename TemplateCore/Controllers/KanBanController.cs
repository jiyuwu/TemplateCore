using Common;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MyFilter;
using Service.DB;
using System.Data;
using System.Text.RegularExpressions;

namespace TemplateCore.Controllers
{
    [NoPermissionRequired]
    public class KanBanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [EnableCors("AllowAnyOrigin")]
        public string GetJsonBySql(string sql)
        {
            if (!string.IsNullOrEmpty(sql))//postgresql会自动转小写，推荐建表直接使用小写或改配置
            {
                sql = QuoteTableNames(sql);
                sql=sql.Replace("IsRead", "\"IsRead\"").Replace("SentDate", "\"SentDate\"");
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
