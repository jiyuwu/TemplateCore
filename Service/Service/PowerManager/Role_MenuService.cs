using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Service.Service.PowerManager
{
  public  class Role_MenuService : IRole_MenuService
    {
        public long BatchAdd(List<Role_Menu> InformationList)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                foreach (Role_Menu Information in InformationList)
                {
                    Information.Create_time = DateTime.Now;
                    Information.Update_time = DateTime.Now;
                    db.Role_Menus.Add(Information);
                }
                db.SaveChanges();
                return InformationList.Count;
            }
        }

        //public Role_Menu GetInfoById(long Id)
        //{
        //    using (BPMDbContext db = new BPMDbContext())
        //    {
        //        var role_Menu = (from e in db.Role_Menus
        //                    where e.Id == Id
        //                    select e).FirstOrDefault();
        //        return role_Menu;
        //    }
        //}

        public List<Role_Menu> GetListByRoleId(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role_Menu = (from e in db.Role_Menus
                            where (e.RoleId == roleId)
                            select e).Where(e => e.State ==1).ToList();
                return role_Menu;
            }
        }

        public List<Role_Menu> GetMenuListByRoleId(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role_Menu = (from e in db.Role_Menus
                                 where (e.RoleId == roleId)
                                 select e).Include(e => e.Menu).Where(e => e.State == 1).ToList();
                return role_Menu;
            }
        }

        public long BatchDel(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                List<Role_Menu> role_MenuList = db.Role_Menus.Where(e => e.RoleId == roleId).ToList();
                db.RemoveRange(role_MenuList);
                db.SaveChanges();
                return role_MenuList.Count;
            }
        }
    }
}
