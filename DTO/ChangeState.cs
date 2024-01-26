using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
   public class ChangeState
    {
        public string Method { get; set; }//操作
        public long Id { get; set; }//Id
        public int State { get; set; } //状态 1.启用 2.禁用
    }
}
