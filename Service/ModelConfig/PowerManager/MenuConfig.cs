using DTO.PowerManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.ModelConfig.PowerManager
{
   public class MenuConfig : IEntityTypeConfiguration<Menu>
    {
        public void Configure(EntityTypeBuilder<Menu> builder)
        {
            builder.ToTable("Menu");
            builder.HasKey(q => q.Id);
            builder.Property(q => q.Name).HasMaxLength(50).IsRequired();
        }
    }
}
