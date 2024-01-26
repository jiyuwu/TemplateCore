using System;
using System.Collections.Generic;
using System.Text;

namespace IService
{
    //约定：
    //只有实现了IServiceSupport接口的服务被注入
    //保证自己需要的服务进行autofac注入
    public interface IServiceSupport
    {
    }
}
