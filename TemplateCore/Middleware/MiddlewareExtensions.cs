using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TemplateCore.Middleware
{
    public static class MiddlewareExtensions
    {
        /// <summary>
        /// 使用websocket通知
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseWebSocketNotify(
          this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WebSocketNotify>();
        }

        /// <summary>
        /// 使用myException拦截异常
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseMyException(
          this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MyException>();
        }
    }
}
