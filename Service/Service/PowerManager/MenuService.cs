using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.Service.PowerManager
{
    public class MenuService : IMenuService
    {
        public long AddNew(Menu Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                Information.Create_time = DateTime.Now;
                Information.Update_time = DateTime.Now;
                db.Menus.Add(Information);
                db.SaveChanges();
                return Information.Id;
            }
        }

        public long ChangeState(ChangeState changeState)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                Menu menu = db.Menus.Where(e => e.Id == changeState.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(menu.Name))
                {
                    menu.Update_time = DateTime.Now;
                    menu.State = changeState.State;
                }
                db.Entry(menu).State = EntityState.Modified;
                db.SaveChanges();
                return menu.Id;
            }
        }

        public long GetCount(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var count = (from e in db.Menus
                             where (e.Name == pageModel.TitleName || pageModel.TitleName == "")
                             select e).Where(e => e.State != 0).Count();
                return count;
            }
        }

        public Menu GetInfoById(long Id)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var menu = (from e in db.Menus
                            where e.Id == Id
                            select e).FirstOrDefault();
                return menu;
            }
        }

        public List<Menu> GetList(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var menu = (from e in db.Menus
                            where (e.Name == pageModel.TitleName || pageModel.TitleName == "")
                            select e).Where(e => e.State != 0).OrderByDescending(e => e.DisplayOrder).Skip((pageModel.CurrentPage - 1) * pageModel.NumCount).Take(pageModel.NumCount).ToList();
                return menu;
            }
        }

        public List<Menu> GetAllList()
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var menu = (from e in db.Menus
                            select e).Where(e => e.State != 0).OrderBy(e => e.DisplayOrder).ToList();
                return menu;
            }
        }

        public long Updata(Menu Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                Menu menu = db.Menus.Where(e => e.Id == Information.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(menu.Name))
                {
                    menu.Name = Information.Name;
                    menu.ParentId = Information.ParentId;
                    menu.UrlOrClass = Information.UrlOrClass;
                    menu.DisplayOrder = Information.DisplayOrder;
                    menu.EnumSgin = Information.EnumSgin;
                    menu.IsLeaf = Information.IsLeaf;
                    menu.Update_time = DateTime.Now;
                    menu.State = Information.State;
                }
                db.Entry(menu).State = EntityState.Modified;
                db.SaveChanges();
                return menu.Id;
            }
        }
    }
}
