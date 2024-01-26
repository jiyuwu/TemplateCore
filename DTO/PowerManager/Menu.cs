using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace DTO.PowerManager
{
    [Serializable]
    public class Menu
    {
        public Menu()
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

        private string name;
        //菜单名称                                       
        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        private int type;
        //1-菜单  2-按钮                                       
        public int Type
        {
            get { return type; }
            set { type = value; }
        }

        private int parentId;
        //父菜单ID                                       
        public int ParentId
        {
            get { return parentId; }
            set { parentId = value; }
        }
        private int enumSgin;
        //枚举标志                                       
        public int EnumSgin
        {
            get { return enumSgin; }
            set { enumSgin = value; }
        }

        private string urlOrClass;
        //菜单地址或按钮                                       
        public string UrlOrClass
        {
            get { return urlOrClass; }
            set { urlOrClass = value; }
        }

        private int isLeaf;
        //叶子节点 ，0-否；1-是                                       
        public int IsLeaf
        {
            get { return isLeaf; }
            set { isLeaf = value; }
        }

        private int displayOrder;
        //显示顺序                                       
        public int DisplayOrder
        {
            get { return displayOrder; }
            set { displayOrder = value; }
        }

        private DateTime create_time;
        //创建时间                                       
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
        private List<Role_Menu> role_Menus;
        public virtual List<Role_Menu> Role_Menus 
        {
            get { return role_Menus; }
            set { role_Menus = value; }
        }//多对多：一个菜单对应多个角色，一个角色对应多个菜单,直接写get;set;序列化会出现k_BackingField
    }
}
