using DTO;
using DTO.PowerManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Service.ModelConfig.PowerManager
{
   public class UserConfig : IEntityTypeConfiguration<User>
    {

        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User");
            builder.HasKey(q => q.Id);
            builder.Property(q => q.Account).HasMaxLength(50).IsRequired();
            builder.Property(q => q.Passwd).HasMaxLength(150).IsRequired();
        }
    }
}
