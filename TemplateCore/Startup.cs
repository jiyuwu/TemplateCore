using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using IService;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using MyFilter;
using TemplateCore.Middleware;

namespace TemplateCore
{
    public class Startup
    {
        
        public void ConfigureServices(IServiceCollection services)
        {
            var serviceAsm = Assembly.Load(new AssemblyName("Service"));
            foreach (Type serviceType in serviceAsm.GetTypes()
            .Where(t => typeof(IServiceSupport).IsAssignableFrom(t) && !t.GetTypeInfo().IsAbstract))
            {
                var interfaceTypes = serviceType.GetInterfaces();
                foreach (var interfaceType in interfaceTypes)
                {
                    services.AddSingleton(interfaceType, serviceType);
                }
            }
            services.AddMvc(opt =>
            {
                opt.Filters.Add<PermissionRequiredFiler>();
                opt.Filters.Add<MyExceptionFiler>();
            });
            services.AddMvc();
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/NoPower");
            }
            #region websocket中间件
            app.UseWebSockets();
            app.UseWebSocketNotify();
            #endregion

            #region 异常中间件
            app.UseMyException();
            #endregion
            app.UseStaticFiles();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });
        }
    }
}
