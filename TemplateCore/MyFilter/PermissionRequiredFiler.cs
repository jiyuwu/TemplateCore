using Common;
using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace MyFilter
{
    public class PermissionRequiredFiler : ActionFilterAttribute
    {
        private IHttpContextAccessor accessor;
        public IMenuService menuService { get; set; }
        public PermissionRequiredFiler(IHttpContextAccessor _accessor, IMenuService _menuService)
        {
            accessor = _accessor;
            menuService = _menuService;
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var isDefined = false;
            var controllerActionDescriptor = filterContext.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor != null)
            {
                bool controllerHasAttribute = controllerActionDescriptor.ControllerTypeInfo.GetCustomAttributes(inherit: true)
                    .Any(a => a.GetType().Equals(typeof(NoPermissionRequiredAttribute)));

                bool actionHasAttribute = controllerActionDescriptor.MethodInfo.GetCustomAttributes(inherit: true)
                    .Any(a => a.GetType().Equals(typeof(NoPermissionRequiredAttribute)));
                isDefined = controllerHasAttribute || actionHasAttribute;
            }
            if (isDefined) return;
            //1.url带token 2.header带token 3.cookie带token
            string token = accessor.HttpContext.Request.Headers["token"];
            if (string.IsNullOrWhiteSpace(token))
            {
                token = accessor.HttpContext.Request.Query["token"];
                if (string.IsNullOrWhiteSpace(token))
                {
                    token = accessor.HttpContext.Request.Cookies["token"];
                }
            }
            if (string.IsNullOrWhiteSpace(token))
            {
                filterContext.Result = new RedirectResult("/Home/Login");
            }
            else
            {
                //string serviceName = filterContext.ActionDescriptor.DisplayName.Split(".")[0];
                string controllerName = filterContext.ActionDescriptor.RouteValues["controller"];
                string actionName = filterContext.ActionDescriptor.RouteValues["action"];
                string path = string.Format("/{0}/{1}",controllerName,actionName);
                var redis = new RedisHelper(1);
                List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
                List<Role_Menu> Mymenus = role_Menus.FindAll(e => e.Menu.UrlOrClass == path);
                if (Mymenus.Count <= 0)
                {
                    filterContext.Result = new RedirectResult("/Home/NoPower");
                }
            }

                base.OnActionExecuting(filterContext);
        }
        
    }
    //不需要验证方法权限

    public class NoPermissionRequiredAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
        }

    }
}
