using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
   public class Article
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Context { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
