using DTO.PowerManager;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.KanBan;

namespace Service.ModelConfig.KanBan
{
   public class KBInfoConfig: IEntityTypeConfiguration<KBInfo>
    {
        public void Configure(EntityTypeBuilder<KBInfo> builder)
        {
            builder.ToTable("KBInfo");
            builder.HasKey(q => q.Id);
            builder.Property(q => q.Title).HasMaxLength(50).IsRequired();
        }
    }
}
