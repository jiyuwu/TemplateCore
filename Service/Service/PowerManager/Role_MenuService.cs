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

        public List<DTO.PowerManager.Role_Menu> GetMenuListByRoleId(long roleId)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var roleMenus = new List<DTO.PowerManager.Role_Menu>();
                var processedMenuIds = new HashSet<long>(); // 用于记录已处理的菜单 ID

                // 递归函数，用于获取子菜单
                void GetChildMenus(long parentId, HashSet<long> processedIds)
                {
                    var childMenus = db.Role_Menus
                        .Where(e => e.RoleId == roleId && e.State == 1 && e.Menu.ParentId == parentId)
                        .Include(e => e.Menu)
                        .ToList();

                    foreach (var childMenu in childMenus)
                    {
                        if (!processedIds.Contains(childMenu.Menu.Id))
                        {
                            processedIds.Add(childMenu.Menu.Id);
                            roleMenus.Add(childMenu);

                            GetChildMenus(childMenu.Menu.Id, processedIds); // 递归调用，获取子菜单的子菜单
                        }
                    }
                }

                // 获取顶级菜单
                var topLevelMenus = db.Role_Menus
                    .Where(e => e.RoleId == roleId && e.State == 1 && e.Menu.ParentId == 0)
                    .Include(e => e.Menu)
                    .ToList();

                // 遍历顶级菜单，递归获取所有子菜单
                foreach (var topLevelMenu in topLevelMenus)
                {
                    processedMenuIds.Add(topLevelMenu.Menu.Id);
                    roleMenus.Add(topLevelMenu);
                    GetChildMenus(topLevelMenu.Menu.Id, processedMenuIds);
                }

                return roleMenus;
            }
        }


        //public List<Role_Menu> GetMenuListByRoleId(long roleId)
        //{
        //    using (BPMDbContext db = new BPMDbContext())
        //    {
        //        var role_Menu = (from e in db.Role_Menus
        //                         where (e.RoleId == roleId)
        //                         select e).Include(e => e.Menu).Where(e => e.State == 1).ToList();
        //        return role_Menu;
        //    }
        //}

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
