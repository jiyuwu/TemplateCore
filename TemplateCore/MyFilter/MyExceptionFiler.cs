using Common;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFilter
{
    public class MyExceptionFiler : Attribute,IExceptionFilter
    {
        public void OnException(ExceptionContext context)//异常拦截备用
        {
            CommonHelper.WriteLog(context.Exception.ToString());
        }
    }
}
