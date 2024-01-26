using DTO;
using DTO.PowerManager;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IService.PowerManager
{
   public interface IUserService: IServiceSupport
    {
        long AddNew(User Information);
        List<User> GetList(PageModel pageModel);
        long GetCount(PageModel pageModel);
        User GetInfoById(long Id);
        long Updata(User Information);
        long ChangeState(ChangeState changeState);
        Task<User> GetUserListByPasswordAsync(string username, string password);
    }
}
