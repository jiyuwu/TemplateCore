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
    public class RoleService : IRoleService
    {
        public long AddNew(Role Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                long nextId = 1; // Default if the table is empty.
                if (db.Roles.Any())
                {
                    nextId = db.Roles.Max(k => k.Id) + 1;
                }
                Information.Id = nextId;
                Information.Create_time = DateTime.Now;
                Information.Update_time = DateTime.Now;
                db.Roles.Add(Information);
                db.SaveChanges();
                return Information.Id;
            }
        }

        public long ChangeState(ChangeState changeState)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                Role role = db.Roles.Where(e => e.Id == changeState.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(role.Role_name))
                {
                    role.Update_time = DateTime.Now;
                    role.State = changeState.State;
                }
                db.Entry(role).State = EntityState.Modified;
                db.SaveChanges();
                return role.Id;
            }
        }

        public long GetCount(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var count = (from e in db.Roles
                             where (e.Role_name == pageModel.TitleName || pageModel.TitleName == "")
                             select e).Where(e => e.State != 0).Count();
                return count;
            }
        }

        public Role GetInfoById(long Id)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role = (from e in db.Roles
                            where e.Id == Id
                            select e).FirstOrDefault();
                return role;
            }
        }

        public List<Role> GetList(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role = (from e in db.Roles
                            where (e.Role_name == pageModel.TitleName || pageModel.TitleName == "")
                            select e).Where(e => e.State != 0).OrderByDescending(e => e.Create_time).Skip((pageModel.CurrentPage - 1) * pageModel.NumCount).Take(pageModel.NumCount).ToList();
                return role;
            }
        }

        public List<Role> GetAllList()
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var role = (from e in db.Roles
                            select e).Where(e => e.State != 0).OrderByDescending(e => e.Create_time).ToList();
                return role;
            }
        }

        public long Updata(Role Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                Role role = db.Roles.Where(e => e.Id == Information.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(role.Role_name))
                {
                    role.Role_name = Information.Role_name;
                    role.Update_time = DateTime.Now;
                    role.State = Information.State;
                }
                db.Entry(role).State = EntityState.Modified;
                db.SaveChanges();
                return role.Id;
            }
        }
    }
}
