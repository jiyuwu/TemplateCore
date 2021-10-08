using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
public class Password
    {
        public int count { get; set; } = 16;
        public bool num { get; set; } = true;
        public bool strUpper { get; set; } = true;
        public bool strLower { get; set; } = true;
        public bool other { get; set; } = true;
    }

}
