using DTO.PowerManager;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.KanBan;

namespace IService.KanBan
{
    public interface IKBInfoService : IServiceSupport
    {
        long AddNew(KBInfo Information);
        List<KBInfo> GetList(PageModel pageModel);
        List<KBInfo> GetAllList();
        long GetCount(PageModel pageModel);
        KBInfo GetInfoById(long Id);
        long Updata(KBInfo Information);
        long Delete(ChangeState changeState);
    }
}
