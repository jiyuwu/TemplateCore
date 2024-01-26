using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Service.PowerManager
{
   public class UserService : IUserService
    {
        public long AddNew(User UserInformation)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                UserInformation.Create_time = DateTime.Now;
                UserInformation.Update_time = DateTime.Now;
                db.Users.Add(UserInformation);
                db.SaveChanges();
                return UserInformation.Id;
            }
        }

        public long ChangeState(ChangeState changeState)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                User user = db.Users.Where(e => e.Id == changeState.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(user.Account))
                {
                    user.Update_time = DateTime.Now;
                    user.State = changeState.State;
                }
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                return user.Id;
            }
        }

        public long GetCount(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var count = (from e in db.Users
                            where (e.Account == pageModel.TitleName || pageModel.TitleName == "")
                            select e).Where(e => e.State != 0).Count();
                return count;
            }
        }

        public User GetInfoById(long Id)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var user = (from e in db.Users
                            where e.Id == Id
                            select e).FirstOrDefault();
                return user;
            }
        }

        public List<User> GetList(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                ////查询部分列
                //var data = from u in db.Users
                //           select new { u.ID, u.NAME, u.SEX, u.NUMBER };
                var user = (from e in db.Users
                                where (e.Account==pageModel.TitleName ||pageModel.TitleName=="") 
                            select e).Where(e=>e.State!=0).OrderByDescending(e => e.Create_time).Skip((pageModel.CurrentPage - 1) * pageModel.NumCount).Take(pageModel.NumCount).ToList();
                return user;
            }
        }

        public long Updata(User Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                User user = db.Users.Where(e => e.Id == Information.Id).FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(user.Account))
                {
                    user.Account = Information.Account;
                    user.Update_time = DateTime.Now;
                    user.State = Information.State;
                    user.RoleId = Information.RoleId;
                }
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                return user.Id;
            }
        }

        public async Task<User> GetUserListByPasswordAsync(string username, string password)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                User user = await (from e in db.Users
                                   where e.Account == username && e.Passwd == password
                                   select e).FirstOrDefaultAsync();
                return user;
            }
        }


    }
}
