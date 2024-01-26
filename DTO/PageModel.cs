using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
   public class PageModel
    {
        public string TitleName { get; set; }//筛选标题
        public int CurrentPage { get; set; }//当前页
        public int NumCount { get; set; } //每页数量
    }
}
