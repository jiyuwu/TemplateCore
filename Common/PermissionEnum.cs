using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class PermissionEnum//控制按钮显示权限：获取操作列表及更新数据等验证
    {
        /// <summary>
        /// 格式化功能代码
        /// </summary>
        /// <param name="obj">功能编辑</param>
        /// <returns></returns>
        public static int CodeFormat(object obj)
        {
            return Convert.ToInt32(obj);
        }
        public static class 权限管理
        {
            public enum 用户
            {
                查看 = 1010101,
                添加 = 1010102,
                编辑 = 1010103,
                删除 = 1010104
            }
            public enum 角色
            {
                查看 = 1010201,
                添加 = 1010202,
                编辑 = 1010203,
                删除 = 1010204
            }
            public enum 权限
            {
                查看 = 1010301,
                添加 = 1010302,
                编辑 = 1010303,
                删除 = 1010304
            }
        }
        public static class 开放平台
        {
            public enum 接口授权
            {
                查看 = 2010101,
                添加 = 2010102,
                编辑 = 2010103,
                删除 = 2010104
            }
            public enum 可视化
            {
                查看 = 2010201,
                添加 = 2010202,
                编辑 = 2010203,
                删除 = 2010204
            }
            public enum 数据详情
            {
                查看 = 2010301
            }
        }
    }
}
