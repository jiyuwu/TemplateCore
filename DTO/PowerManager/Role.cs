using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.PowerManager
{
    [Serializable]
    public class Role
    {
        public Role()
        {
            this.Role_Menus = new List<Role_Menu>();
        }

        private long id;
        //                                       
        public long Id
        {
            get { return id; }
            set { id = value; }
        }

        private string role_name;
        //                                       
        public string Role_name
        {
            get { return role_name; }
            set { role_name = value; }
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
        public virtual List<Role_Menu> Role_Menus { get; set; }
        public string MenuIds { get; set; }
    }
}
