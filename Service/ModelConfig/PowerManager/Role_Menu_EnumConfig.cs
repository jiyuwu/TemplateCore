using DTO;
using DTO.PowerManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.ModelConfig.PowerManager
{
   public class Role_Menu_EnumConfig : IEntityTypeConfiguration<Role_Menu_Enum>
    {
        public void Configure(EntityTypeBuilder<Role_Menu_Enum> builder)
        {
            builder.ToTable("Role_Menu_Enum");
            builder.HasKey(q => q.Id);
        }
    }
}
