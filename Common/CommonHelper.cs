using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.DrawingCore;
using System.DrawingCore.Imaging;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Common
{
   public class CommonHelper
    {
        #region 数据处理公共方法
        public static string IsNullOrWhiteSpaceChange(string s)
        {
            if (string.IsNullOrWhiteSpace(s))
            {
                s = "";
            }
            return s;
        }
        #endregion
        #region 返回json
        public static string CodeJson(string code, string msg)
        {
            return "{\"code\":\"" + code + "\",\"msg\":\"" + msg + "\"}";
        }
        /// <summary>
        /// 得到一个包含Json信息的JsonResult
        /// </summary>
        /// <param name="isOK">服务器处理是否成功</param>
        /// <param name="msg">报错消息</param>
        /// <param name="nextUrl">下个要访问的地址</param>
        /// <param name="data">携带的额外信息</param>
        /// <returns></returns>
        public static JsonResult GetJsonResult(bool isOK, string msg, string nextUrl = null, object data = null)
        {
            var jsonObj = new { isOK = isOK, msg = msg, nextUrl = nextUrl, data = data };
            return new JsonResult(jsonObj)
            {
                Value = jsonObj
            };
        }

        public static string NewGetJsonResult(int code, string msg, object data = null)
        {
            var jsonObj = new { code = code, msg = msg, data = data };
            return Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj);
        }

        /// <summary>
        /// 得到“***必须填写”的消息
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static JsonResult GetValidationMsg_Empty(string name)
        {
            return GetJsonResult(false, name + "必须填！");
        }
        #endregion

        #region 页面布局常用生成
        /// <summary>
        /// 绘制页面Html代码
        /// </summary>
        /// <param name="urlFormat">页码链接格式，页码的占位符为{pageIndex}，比如/Message/Page/{pageIndex}</param>
        /// <param name="pageIndex">当前页码，从1开始</param>
        /// <param name="totalCount">总数据条数</param>
        /// <param name="pageSize">每一页显示多少数据</param>
        /// <returns></returns>
        public static HtmlString Pager(string urlFormat, int pageIndex,
            int totalCount, int pageSize = 10)
        {
            StringBuilder sbHTML = new StringBuilder();
            int pageCount = (int)Math.Ceiling(totalCount * 1.0 / pageSize);//一共显示多少页
            int startPageIndex = Math.Max(1, pageIndex - 5);//不会一下子把所有页码都显示出来，在当前页码前再最多显示5个
            int endPageIndex = Math.Min(pageCount, startPageIndex + 10 - 1);//一共最多显示10个页码
            sbHTML.Append("<a class='prev' href='").Append(urlFormat.Replace("|pageIndex|", 1.ToString())).Append("''>首页</a>");
            for (int i = startPageIndex; i <= endPageIndex; i++)
            { //<a class='prev' href=''>&lt;&lt;</a><a class='num' href=''>1</a><span class='current'>2</span><a class='next' href=''>&gt;&gt;</a>
                if (i == pageIndex)
                {
                    sbHTML.Append("<span class='current'>").Append(i).Append("</span>");
                }
                else
                {
                    sbHTML.Append("<a href='").Append(urlFormat.Replace("|pageIndex|", i.ToString())).Append("'>").Append(i)
                        .Append("</a>");
                }
            }
            sbHTML.Append("<a class='next' href='").Append(urlFormat.Replace("|pageIndex|", pageCount.ToString())).Append("''>末页</a>");
            return new HtmlString(sbHTML.ToString());
        }

        #endregion

        #region 加解密
        public static string _KEY = "JIYUWU66";  //密钥
        public static string _IV = "JIYUWU88";   //向量

        /// <summary>
        /// des 加密
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string DesEncypt(string data)
        {

            byte[] byKey = System.Text.ASCIIEncoding.ASCII.GetBytes(_KEY);
            byte[] byIV = System.Text.ASCIIEncoding.ASCII.GetBytes(_IV);

            using (DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider())
            using (MemoryStream ms = new MemoryStream())
            using (CryptoStream cst = new CryptoStream(ms, cryptoProvider.CreateEncryptor(byKey, byIV), CryptoStreamMode.Write))
            using (StreamWriter sw = new StreamWriter(cst))
            {
                int i = cryptoProvider.KeySize;
                sw.Write(data);
                sw.Flush();
                cst.FlushFinalBlock();
                sw.Flush();
                string strRet = Convert.ToBase64String(ms.GetBuffer(), 0, (int)ms.Length);
                return strRet;
            }
        }

        /// <summary>
        /// des解密
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string DesDecrypt(string data)
        {

            byte[] byKey = System.Text.ASCIIEncoding.ASCII.GetBytes(_KEY);
            byte[] byIV = System.Text.ASCIIEncoding.ASCII.GetBytes(_IV);

            byte[] byEnc;

            try
            {
                data.Replace("_%_", "/");
                data.Replace("-%-", "#");
                byEnc = Convert.FromBase64String(data);

            }
            catch
            {
                return null;
            }

            using (DESCryptoServiceProvider cryptoProvider = new DESCryptoServiceProvider())
            using (MemoryStream ms = new MemoryStream(byEnc))
            using (CryptoStream cst =
                new CryptoStream(ms, cryptoProvider.CreateDecryptor(byKey, byIV), CryptoStreamMode.Read))
            using (StreamReader sr = new StreamReader(cst))
            {
                return sr.ReadToEnd();
            }
        }

        public static string CalcMD5(string str)
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(str);
            return CalcMD5(bytes);
        }

        public static string CalcMD5(byte[] bytes)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] computeBytes = md5.ComputeHash(bytes);
                string result = "";
                for (int i = 0; i < computeBytes.Length; i++)
                {
                    result += computeBytes[i].ToString("X").Length == 1 ? "0" + computeBytes[i].ToString("X") : computeBytes[i].ToString("X");
                }
                return result;
            }
        }

        public static string CalcMD5(Stream stream)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] computeBytes = md5.ComputeHash(stream);
                string result = "";
                for (int i = 0; i < computeBytes.Length; i++)
                {
                    result += computeBytes[i].ToString("X").Length == 1 ? "0" + computeBytes[i].ToString("X") : computeBytes[i].ToString("X");
                }
                return result;
            }
        }

        ///编码
        public static string EncodeBase64(string code_type, string code)
        {
            string encode = "";
            byte[] bytes = Encoding.GetEncoding(code_type).GetBytes(code);
            try
            {
                encode = Convert.ToBase64String(bytes);
            }
            catch
            {
                encode = code;
            }
            return encode;
        }
        ///解码
        public static string DecodeBase64(string code_type, string code)
        {
            string decode = "";
            byte[] bytes = Convert.FromBase64String(code);
            try
            {
                decode = Encoding.GetEncoding(code_type).GetString(bytes);
            }
            catch
            {
                decode = code;
            }
            return decode;
        }
        #endregion
        #region json序列化与反序列化
        #region model<->json(对象和json互转)
        #region DataContractJsonSerializer
        public static string SerializeDataContractJson<T>(T obj)
        {
            DataContractJsonSerializer json = new DataContractJsonSerializer(obj.GetType());
            using (MemoryStream stream = new MemoryStream())
            {
                json.WriteObject(stream, obj);
                string szJson = Encoding.UTF8.GetString(stream.ToArray());
                return szJson;
            }
        }
        public static T DeserializeDataContractJson<T>(string szJson)
        {
            T obj = Activator.CreateInstance<T>();
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(szJson)))
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
                return (T)serializer.ReadObject(ms);
            }
        }
        #endregion

        #region Newtonsoft
        static public string SerializeJSON<T>(T data)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(data);
        }
        static public T DeserializeJSON<T>(string json)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(json);
        }
        #endregion
        #endregion

        #region datatable<->json（datatable和json互转）
        public static string SerializeDataTableToJSON(DataTable dt)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(dt);
        }
        public static DataTable SerializeJSONToDataTable(string json)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(json);
        }
        #region 自己写datatable转json用于测试速度对比下
        public static string MyDataTableToJson(DataTable dt)
        {
            StringBuilder JsonString = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                JsonString.Append("{ ");
                JsonString.Append("\"TableInfo\":[ ");
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    JsonString.Append("{ ");
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        if (j < dt.Columns.Count - 1)
                        {
                            JsonString.Append("\"" + dt.Columns[j].ColumnName.ToString() + "\":" + "\"" + dt.Rows[i][j].ToString() + "\",");
                        }
                        else if (j == dt.Columns.Count - 1)
                        {
                            JsonString.Append("\"" + dt.Columns[j].ColumnName.ToString() + "\":" + "\"" + dt.Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == dt.Rows.Count - 1)
                    {
                        JsonString.Append("} ");
                    }
                    else
                    {
                        JsonString.Append("}, ");
                    }
                }
                JsonString.Append("]}");
                return JsonString.ToString();
            }
            else
            {
                return null;
            }
        }
        #endregion
        #endregion

        #endregion


        #region model<->json
        public static string GetJson<T>(T obj)
        {
            DataContractJsonSerializer json = new DataContractJsonSerializer(obj.GetType());
            using (MemoryStream stream = new MemoryStream())
            {
                json.WriteObject(stream, obj);
                string szJson = Encoding.UTF8.GetString(stream.ToArray());
                return szJson;
            }
        }
        public static T ParseFromJson<T>(string szJson)
        {
            T obj = Activator.CreateInstance<T>();
            using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(szJson)))
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
                return (T)serializer.ReadObject(ms);
            }
        }
        #endregion
        #region list<->josn
        /// <summary>   
        ///  将json转成实体对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="JsonStr"></param>
        /// <returns></returns>
        public static List<T> GetListFromJson<T>(string JsonStr)
        {
            //JavaScriptSerializer Serializer = new JavaScriptSerializer();
            //List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            //return objs;
            List<T> objs = Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(JsonStr);
            return objs;
        }
        static public string SerializeJSON<T>(List<T> data)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(data);
        }
        #endregion

        #region 验证码
        public static byte[] Bitmap2Byte(Bitmap bitmap)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                bitmap.Save(stream, ImageFormat.Jpeg);
                byte[] data = new byte[stream.Length];
                stream.Seek(0, SeekOrigin.Begin);
                stream.Read(data, 0, Convert.ToInt32(stream.Length));
                return data;
            }
        }
        #endregion

        #region Log
        /// <summary>
        /// 常规日志
        /// </summary>
        /// <param name="s"></param>
        public static void WriteLog(string s)
        {
            var path = Directory.GetCurrentDirectory()+"\\LogAll";//文件保存位置
            TextHelper.WriteLog(s, path);
        }
        /// <summary>
        /// 错误日志保存
        /// </summary>
        /// <param name="s"></param>
        public static void WriteErrorLog(string s)
        {
            var path = Directory.GetCurrentDirectory()+ "\\LogAll\\LogError";
            TextHelper.WriteLog(s, path);
        }
        /// <summary>
        /// 警告日志保存
        /// </summary>
        /// <param name="s"></param>
        public static void WriteWareLog(string s)
        {
            var path = Directory.GetCurrentDirectory() + "\\LogAll\\LogWare";
            TextHelper.WriteLog(s, path);
        }
        #endregion


        #region 旧返回json
        /// <summary>
        /// 得到一个包含Json信息的JsonResult
        /// </summary>
        /// <param name="isOK">服务器处理是否成功 1.成功 -1.失败 0.没有数据</param>
        /// <param name="msg">报错消息</param>
        /// <param name="data">携带的额外信息</param>
        /// <returns></returns>
        public static string GetJsonResult(int code, string msg, object data = null)
        {
            var jsonObj = new { code = code, msg = msg, data = data };
            return Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj);
        }
        public static string GetJsonFormat(int code, string msg, string data = null)
        {
            if (data != null)
                return "{" + string.Format("\"code\":{0},\"msg\":\"{1}\",\"data\":{2}", code, msg, data) + "}";
            else
                return "{" + string.Format("\"code\":{0},\"msg\":\"{1}\"", code, msg) + "}";
        }
        public static string CodeJson2(string code, string msg)
        {
            return "{\"code\":\"" + code + "\",\"msg\":\"" + msg + "\"}";
        }
        #endregion

        #region 密码生成
        public static string MakePassword(int pwdLength,string pwdchars)
        { 
            StringBuilder tmpstr = new StringBuilder();
            int iRandNum;
            Random rnd = new Random();
            for (int i = 0; i < pwdLength; i++)
            {   
                iRandNum = rnd.Next(pwdchars.Length);
                tmpstr.Append(pwdchars[iRandNum]);
            }
            return tmpstr.ToString();
        }
        #endregion
    }
}
