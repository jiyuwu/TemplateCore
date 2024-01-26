using DTO;
using DTO.PowerManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.ModelConfig.PowerManager
{
   public class RoleConfig : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Role");
            builder.HasKey(q => q.Id);
            builder.Ignore(q => q.MenuIds);
        }
    }
}
