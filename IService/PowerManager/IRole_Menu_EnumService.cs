using DTO;
using DTO.PowerManager;
using System;
using System.Collections.Generic;
using System.Text;

namespace IService.PowerManager
{
   public interface IRole_Menu_EnumService : IServiceSupport
    {
        long BatchAdd(List<Role_Menu_Enum> InformationList);
        Role_Menu_Enum GetInfoById(long Id);
        List<Role_Menu_Enum> GetListByRoleId(long roleId);
        long BatchDel(long roleId);
    }
}
