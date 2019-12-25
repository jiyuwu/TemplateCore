using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TemplateCore.Middleware
{
    public class MyException
    {
        private readonly RequestDelegate _next;

        public MyException(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
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
                var statusCode = context.Response.StatusCode;
                if (statusCode == 404 || statusCode == 500)
                {
                    await context.Response.WriteAsync(statusCode.ToString());
                }
            }
        }
    }
}
