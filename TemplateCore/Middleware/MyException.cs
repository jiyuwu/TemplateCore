using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TemplateCore.Middleware
{
    public class MyException
    {
        /// <summary>
        /// 管道代理对象
        /// </summary>
        private readonly RequestDelegate _next;
        /// <summary>
        /// 构造函数传入下一个中间件
        /// </summary>
        /// <param name="next"></param>
        public MyException(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);//调用下一个中间件
            }
            catch (Exception ex)//异常捕获
            {
                Console.WriteLine(string.Format("{0}异常捕获,打印日志：{1}",DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:ms")), ex.ToString()));
                if (context.Response.HasStarted)
                {
                    throw;
                }
                try
                {
                    context.Response.Clear();
                    context.Response.StatusCode = 500;
                    return;
                }
                catch (Exception ex2)
                {
                }
                throw;
            }
            finally
            {
                var statusCode = context.Response.StatusCode;//根据StatusCode返回友好的信息
                if (statusCode == 404 || statusCode == 500)
                {
                    await context.Response.WriteAsync(statusCode.ToString());
                }
            }
        }
    }
}
