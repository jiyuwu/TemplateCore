using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using DTO.PowerManager;

namespace Service.ModelConfig.PowerManager
{
   public class Role_MenuConfig : IEntityTypeConfiguration<Role_Menu>
    {
        public void Configure(EntityTypeBuilder<Role_Menu> builder)
        {
            builder.ToTable("Role_Menu");
            builder.HasKey(l => new { l.MenuId, l.RoleId });//主键
            //builder.HasOne(l => l.Menu).WithMany(l => l.Role_Menus).HasForeignKey(l => l.MenuId);
            builder.HasOne(l => l.Role).WithMany(l => l.Role_Menus).HasForeignKey(l => l.RoleId);
        }
    }
}
