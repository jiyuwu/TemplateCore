using DTO.PowerManager;
using DTO;
using IService.PowerManager;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IService.KanBan;
using DTO.KanBan;

namespace Service.Service.KanBan
{
    public class KBInfoService : IKBInfoService
    {
        public long AddNew(KBInfo Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                long nextId = 1; // Default if the table is empty.
                if (db.KBInfos.Any())
                {
                    nextId = db.KBInfos.Max(k => k.Id) + 1;
                }
                Information.Id = nextId;
                Information.Createdate = DateTime.Now;
                Information.Editdate = DateTime.Now;
                db.KBInfos.Add(Information);
                db.SaveChanges();
                return Information.Id;
            }
        }

        public long Delete(ChangeState changeState)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                int result= db.KBInfos.Where(e => e.Id == changeState.Id).ExecuteDelete();
                return result;
            }
        }

        public long GetCount(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var count = (from e in db.KBInfos
                             where (e.Title == pageModel.TitleName || pageModel.TitleName == "")
                             select e).Count();
                return count;
            }
        }

        public KBInfo GetInfoById(long Id)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var info = (from e in db.KBInfos
                            where e.Id == Id
                            select e).FirstOrDefault();
                return info;
            }
        }

        public List<KBInfo> GetList(PageModel pageModel)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var info = (from e in db.KBInfos
                            where (e.Title == pageModel.TitleName || pageModel.TitleName == "")
                            select e).OrderByDescending(e => e.Createdate).Skip((pageModel.CurrentPage - 1) * pageModel.NumCount).Take(pageModel.NumCount).ToList();
                return info;
            }
        }

        public List<KBInfo> GetAllList()
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                var info = (from e in db.KBInfos
                            select e).OrderBy(e => e.Createdate).ToList();
                return info;
            }
        }

        public long Updata(KBInfo Information)
        {
            using (BPMDbContext db = new BPMDbContext())
            {
                KBInfo? info = db.KBInfos.Where(e => e.Id == Information.Id).FirstOrDefault();
                if (info != null && !string.IsNullOrWhiteSpace(info.Title))
                {
                    info.Title = Information.Title;
                    info.Refreshtime = Information.Refreshtime;
                    info.Edituser = Information.Edituser;
                    info.Description = Information.Description;
                    info.Modelcode = Information.Modelcode;
                    info.Viewlink = Information.Viewlink;
                    info.Editdate = DateTime.Now;
                    info.Type = Information.Type;
                    db.Entry(info).State = EntityState.Modified;
                    db.SaveChanges();
                    return info.Id;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
