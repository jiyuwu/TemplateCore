using System;
using System.Collections.Generic;
using System.DrawingCore;
using System.DrawingCore.Imaging;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;

namespace Common
{
   public class CommonHelper
    {
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
        static public string SerializeJSON<T>(T data)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(data);
        }
        static public T DeserializeJSON<T>(string json)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(json);
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

        #region 返回json
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
            if(data!=null)
                return "{"+string.Format("\"code\":{0},\"msg\":\"{1}\",\"data\":{2}", code, msg, data)+"}";
            else
                return "{" + string.Format("\"code\":{0},\"msg\":\"{1}\"", code, msg) + "}";
        }
        public static string CodeJson(string code, string msg)
        {
            return "{\"code\":\"" + code + "\",\"msg\":\"" + msg + "\"}";
        }
        #endregion


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
            JIYUWU.TXT.TXTHelper.WriteLog(s, path);
        }
        /// <summary>
        /// 错误日志保存
        /// </summary>
        /// <param name="s"></param>
        public static void WriteErrorLog(string s)
        {
            var path = Directory.GetCurrentDirectory()+ "\\LogAll\\LogError";
            JIYUWU.TXT.TXTHelper.WriteLog(s, path);
        }
        /// <summary>
        /// 警告日志保存
        /// </summary>
        /// <param name="s"></param>
        public static void WriteWareLog(string s)
        {
            var path = Directory.GetCurrentDirectory() + "\\LogAll\\LogWare";
            JIYUWU.TXT.TXTHelper.WriteLog(s, path);
        }
        #endregion
    }
}
