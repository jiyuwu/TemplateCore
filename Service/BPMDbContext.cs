using Common;
using DTO;
using DTO.PowerManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Service
{
   public class BPMDbContext: DbContext//继承自DbContext ,并重写OnConfiguring及OnModelCreating方法
    {
        /// <summary>
        /// 配置连接字符串
        /// </summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseNpgsql(AppSettingsHelper.Configuration.GetConnectionString("PostgresConnection"));

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Role_Menu> Role_Menus { get; set; }
        public DbSet<Role_Menu_Enum> Role_Menu_Enums { get; set; }

        /// <summary>
        /// 重写模型绑定的方法OnModelCreating，然后设置对应实体属性的规则(约定)，这种方式叫做Fluent API
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                .Where(q => q.GetInterface(typeof(IEntityTypeConfiguration<>).FullName) != null);
            foreach (var type in typesToRegister)
            {
                dynamic configurationInstance = Activator.CreateInstance(type);
                modelBuilder.ApplyConfiguration(configurationInstance);
            }
        }

    }
}
