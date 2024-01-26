using DTO;
using DTO.PowerManager;
using System;
using System.Collections.Generic;
using System.Text;

namespace IService.PowerManager
{
   public interface IMenuService : IServiceSupport
    {
        long AddNew(Menu Information);
        List<Menu> GetList(PageModel pageModel);
        List<Menu> GetAllList();
        long GetCount(PageModel pageModel);
        Menu GetInfoById(long Id);
        long Updata(Menu Information);
        long ChangeState(ChangeState changeState);
    }
}
