using DTO;
using DTO.PowerManager;
using System;
using System.Collections.Generic;
using System.Text;

namespace IService.PowerManager
{
   public interface IRole_MenuService : IServiceSupport
    {
        long BatchAdd(List<Role_Menu> InformationList);
        //Role_Menu GetInfoById(long Id);
        List<Role_Menu> GetListByRoleId(long roleId);
        List<Role_Menu> GetMenuListByRoleId(long roleId);
        long BatchDel(long roleId);
    }
}
