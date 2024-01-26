using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Service.Service.PowerManager
{
    public class Role_Menu_EnumService : IRole_Menu_EnumService
    {
        public long BatchAdd(List<Role_Menu_Enum> InformationList)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                foreach (Role_Menu_Enum Information in InformationList)
                {
                    Information.Create_time = DateTime.Now;
                    Information.Update_time = DateTime.Now;
                    db.Role_Menu_Enums.Add(Information);
                }
                db.SaveChanges();
                return InformationList.Count;
            }
        }

        public long BatchDel(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                List<Role_Menu_Enum> role_Menu_EnumList = db.Role_Menu_Enums.Where(e => e.Id == roleId).ToList();
                db.RemoveRange(role_Menu_EnumList);
                db.SaveChanges();
                return role_Menu_EnumList.Count;
            }
        }

        public Role_Menu_Enum GetInfoById(long Id)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role_Menu_Enum = (from e in db.Role_Menu_Enums
                                 where e.Id == Id
                                 select e).FirstOrDefault();
                return role_Menu_Enum;
            }
        }

        public List<Role_Menu_Enum> GetListByRoleId(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role_Menu_Enum = (from e in db.Role_Menu_Enums
                                 where (e.RoleId == roleId)
                                 select e).Where(e => e.State != 0).ToList();
                return role_Menu_Enum;
            }
        }
    }
}
