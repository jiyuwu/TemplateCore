using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.PowerManager
{
    [Serializable]
    public class Role_Menu
    {
        public Role_Menu()
        {
        }

        private long roleId;
        //                                       
        public long RoleId
        {
            get { return roleId; }
            set { roleId = value; }
        }

        private long menuId;
        //                                       
        public long MenuId
        {
            get { return menuId; }
            set { menuId = value; }
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
        public virtual Role Role { get; set; }//多对多：一个菜单对应多个角色，一个角色对应多个菜单（中间关联）
        public virtual Menu Menu { get; set; }
    }
}
