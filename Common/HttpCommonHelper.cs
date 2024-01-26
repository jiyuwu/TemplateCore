using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class HttpCommonHelper
    {
        private IHttpContextAccessor httpContextAccessor;
        public HttpCommonHelper(IHttpContextAccessor _httpContextAccessor)
        {
            httpContextAccessor = _httpContextAccessor;
        }
        public string GetToken()
        {
            string token = httpContextAccessor.HttpContext.Request.Headers["token"];
            if (string.IsNullOrWhiteSpace(token))
            {
                token = httpContextAccessor.HttpContext.Request.Query["token"];
                if (string.IsNullOrWhiteSpace(token))
                {
                    token = httpContextAccessor.HttpContext.Request.Cookies["token"];
                }
            }
            return token;
        }
        public string GetIP()
        {
            return httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        }

        public int GetPort()
        {
            return httpContextAccessor.HttpContext.Connection.LocalPort;
        }
    }
}
