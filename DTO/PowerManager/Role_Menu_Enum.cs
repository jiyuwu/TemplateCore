using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.PowerManager
{
   public class Role_Menu_Enum
    {
        public Role_Menu_Enum()
        {
        }

        private long id;
        //                                       
        public long Id
        {
            get { return id; }
            set { id = value; }
        }

        private int roleId;
        //                                       
        public int RoleId
        {
            get { return roleId; }
            set { roleId = value; }
        }

        private int menuId;
        //                                       
        public int MenuId
        {
            get { return menuId; }
            set { menuId = value; }
        }

        private int enumId;
        //                                       
        public int EnumId
        {
            get { return enumId; }
            set { enumId = value; }
        }
        private DateTime create_time;
        //                                       
        public DateTime Create_time
        {
            get { return create_time; }
            set { create_time = value; }
        }

        private DateTime update_time;
        //                                       
        public DateTime Update_time
        {
            get { return update_time; }
            set { update_time = value; }
        }

        private int state;
        //                                       
        public int State
        {
            get { return state; }
            set { state = value; }
        }
    }
}
