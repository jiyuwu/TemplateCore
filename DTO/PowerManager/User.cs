using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.PowerManager
{
    [Serializable]
    public class User
    {
        public User()
        {
        }

        private long id;
        //管理员id,自增字段                                       
        public long Id
        {
            get { return id; }
            set { id = value; }
        }

        private string account;
        //管理员账号                                       
        public string Account
        {
            get { return account; }
            set { account = value; }
        }

        private string passwd;
        //管理员密码                                       
        public string Passwd
        {
            get { return passwd; }
            set { passwd = value; }
        }

        private int state;
        //                                       
        public int State
        {
            get { return state; }
            set { state = value; }
        }

        private DateTime create_time;
        //创建时间                                       
        public DateTime Create_time
        {
            get { return create_time; }
            set { create_time = value; }
        }

        private DateTime update_time;
        //更新日期                                       
        public DateTime Update_time
        {
            get { return update_time; }
            set { update_time = value; }
        }
        //角色Id
        public long RoleId { get; set; }
    }
}
