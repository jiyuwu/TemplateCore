using DTO;
using DTO.PowerManager;
using System;
using System.Collections.Generic;
using System.Text;

namespace IService.PowerManager
{
   public interface IRoleService: IServiceSupport
    {
        long AddNew(Role Information);
        List<Role> GetList(PageModel pageModel);
        List<Role> GetAllList();
        long GetCount(PageModel pageModel);
        Role GetInfoById(long Id);
        long Updata(Role Information);
        long ChangeState(ChangeState changeState);
    }
}
