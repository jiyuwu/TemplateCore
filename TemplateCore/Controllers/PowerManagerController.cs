using Common;
using DTO;
using DTO.PowerManager;
using IService.PowerManager;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BPM.Controllers
{
    public class PowerManagerController : Controller
    {
        public IUserService userService { get; set; }
        User user = new User();
        public IMenuService menuService { get; set; }
        Menu menu = new Menu();
        public IRoleService roleService { get; set; }
        Role role = new Role();
        public IRole_MenuService role_MenuService { get; set; }
        Role_Menu role_Menu = new Role_Menu();
        public IRole_Menu_EnumService role_Menu_EnumService { get; set; }
        Role_Menu_Enum role_Menu_Enum = new Role_Menu_Enum();

        public HttpCommonHelper httpCommonHelper { get; set; }
        public PowerManagerController(IUserService _userService, IMenuService _menuService, IRoleService _roleService, 
            IRole_MenuService _role_MenuService, IRole_Menu_EnumService _role_Menu_EnumService, IHttpContextAccessor _accessor)
        {
            userService = _userService;
            menuService = _menuService;
            roleService = _roleService;
            role_MenuService = _role_MenuService;
            role_Menu_EnumService = _role_Menu_EnumService;
            httpCommonHelper = new HttpCommonHelper(_accessor);
        }
        #region 用户
        public IActionResult UserList(PageModel pageModel)
        {
            #region 节点权限控制 
            string token = httpCommonHelper.GetToken();
            var redis = new RedisHelper(1);
            User user = redis.StringGet<User>(token);
            List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
            ViewBag.Del = 0;
            ViewBag.Add = 0;
            ViewBag.Edit = 0;
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.用户.查看)).Count <= 0)
            {
                return Redirect("../Home/NoPower");
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.用户.删除)).Count > 0)
            {
                ViewBag.Del = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.用户.添加)).Count > 0)
            {
                ViewBag.Add = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.用户.编辑)).Count > 0)
            {
                ViewBag.Edit = 1;
            }
            #endregion
            pageModel.TitleName = Common.CommonHelper.IsNullOrWhiteSpaceChange(pageModel.TitleName);
            pageModel.NumCount = pageModel.NumCount == 0 ? 10 : pageModel.NumCount;
            pageModel.CurrentPage = pageModel.CurrentPage == 0 ? 1 : pageModel.CurrentPage;
            ViewBag.PageModel = pageModel;
            List<User> userList = userService.GetList(pageModel);
            int allCount = (int)userService.GetCount(pageModel);
            ViewBag.AllCount = allCount;
            string NewShowPager = string.Format("UserList?CurrentPage=|pageIndex|&NumCount={0}", pageModel.NumCount);
            if (!string.IsNullOrWhiteSpace(pageModel.TitleName))
            {
                NewShowPager = NewShowPager + "&TitleName=" + pageModel.TitleName;
            }
            ViewBag.Page = CommonHelper.Pager(NewShowPager, pageModel.CurrentPage, allCount, pageModel.NumCount);
            return View(userList);
        }
        public IActionResult UserAddOrEdit()
        {
            IQueryCollection queryParameters = HttpContext.Request.Query;
            long Id = Convert.ToInt64(queryParameters["Id"]);
            ViewBag.Id = Id;
            User user = userService.GetInfoById(Id);
            if (user == null)
            {
                user = new User();
                user.Account = "";
                user.State =1;
            }
            List<Role> roles = roleService.GetAllList();
            ViewBag.User = user;
            ViewBag.Role = roles;
            return View();
        }
        [HttpPost]
        public IActionResult UserSave(User user)
        {
            bool b = false;
            if (user.Id > 0)
            {
                long x = userService.Updata(user);
                if (x > 0)
                    b = true;
            }
            else
            {
                long x = userService.AddNew(user);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/UserSave");
        }
        [HttpPost]
        public IActionResult UserChangeStute(ChangeState changeState)
        {
            bool b = false;
            if (changeState.Id > 0)
            {
                long x = userService.ChangeState(changeState);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/UserChangeStute");
        }
        #endregion

        #region 权限
        public IActionResult MenuList()
        {
            #region 节点权限控制 
            string token = httpCommonHelper.GetToken();
            var redis = new RedisHelper(1);
            User user = redis.StringGet<User>(token);
            List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
            ViewBag.Del = 0;
            ViewBag.Add = 0;
            ViewBag.Edit = 0;
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.权限.查看)).Count <= 0)
            {
                return Redirect("../Home/NoPower");
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.权限.删除)).Count > 0)
            {
                ViewBag.Del = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.权限.添加)).Count > 0)
            {
                ViewBag.Add = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.权限.编辑)).Count > 0)
            {
                ViewBag.Edit = 1;
            }
            #endregion
            return View();
        }
        private static List<object> BuildMenuTree(List<Menu> menuList)
        {
            // Create a lookup for parent-child relationships
            var lookup = menuList.ToLookup(m => m.ParentId, m => m);

            // Helper function to recursively build the tree
            object BuildNode(Menu menu)
            {
                var node = new Dictionary<string, object>
            {
                { "id", menu.Id },
                { "name", menu.Name },
                { "type", menu.Type },
                { "enumSgin", menu.EnumSgin },
                { "urlOrClass", menu.UrlOrClass },
                { "isLeaf", menu.IsLeaf },
                { "displayOrder", menu.DisplayOrder },
                { "create_time", menu.Create_time },
                { "update_time", menu.Update_time },
                { "state", menu.State },
                // Add other properties as needed
            };

                var children = lookup[Convert.ToInt32(menu.Id)].ToList();
                if (children.Any())
                {
                    node["children"] = children.Select(BuildNode).ToList();
                }

                return node;
            }


            // Get top-level nodes (ParentId = 0)
            var topLevelNodes = lookup[0].ToList();
            return topLevelNodes.Select(BuildNode).ToList();
        }
        public string AllMenuList()
        {
            List<Menu> menuList = menuService.GetAllList();
            var treeData = BuildMenuTree(menuList);
            string  getJson= "{\"code\":0,\"msg\":\"true\",\"data\":" + CommonHelper.SerializeJSON(treeData) + ",\"count\":"+ menuList.Count + "}";
            return getJson;
        }
        public IActionResult MenuAddOrEdit()
        {
            IQueryCollection queryParameters = HttpContext.Request.Query;
            long Id = Convert.ToInt64(queryParameters["Id"]);
            ViewBag.Id = Id;
            menu = menuService.GetInfoById(Id);
            if (menu == null)
            {
                menu = new Menu();
                menu.Name = "";
                menu.State = 1;
            }
            ViewBag.Menu = menu;
            return View();
        }
        [HttpPost]
        public IActionResult MenuSave(Menu menu)
        {
            bool b = false;
            if (menu.Id > 0)
            {
                long x = menuService.Updata(menu);
                if (x > 0)
                    b = true;
            }
            else
            {
                long x = menuService.AddNew(menu);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/MenuSave");
        }
        [HttpPost]
        public IActionResult MenuChangeStute(ChangeState changeState)
        {
            bool b = false;
            if (changeState.Id > 0)
            {
                long x = menuService.ChangeState(changeState);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/MenuChangeStute");
        }
        #endregion

        #region 角色
        public IActionResult RoleList(PageModel pageModel)
        {
            #region 节点权限控制 
            string token = httpCommonHelper.GetToken();
            var redis = new RedisHelper(1);
            User user = redis.StringGet<User>(token);
            List<Role_Menu> role_Menus = redis.StringGet<List<Role_Menu>>(token + "_Power");
            ViewBag.Del = 0;
            ViewBag.Add = 0;
            ViewBag.Edit = 0;
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.角色.查看)).Count <= 0)
            {
                return Redirect("../Home/NoPower");
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.角色.删除)).Count > 0)
            {
                ViewBag.Del = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.角色.添加)).Count > 0)
            {
                ViewBag.Add = 1;
            }
            if (role_Menus.FindAll(e => e.Menu.EnumSgin == PermissionEnum.CodeFormat(PermissionEnum.权限管理.角色.编辑)).Count > 0)
            {
                ViewBag.Edit = 1;
            }
            #endregion
            pageModel.TitleName = Common.CommonHelper.IsNullOrWhiteSpaceChange(pageModel.TitleName);
            pageModel.NumCount = pageModel.NumCount == 0 ? 10 : pageModel.NumCount;
            pageModel.CurrentPage = pageModel.CurrentPage == 0 ? 1 : pageModel.CurrentPage;
            ViewBag.PageModel = pageModel;
            List<Role> roleList = roleService.GetList(pageModel);
            int allCount = (int)roleService.GetCount(pageModel);
            ViewBag.AllCount = allCount;
            string NewShowPager = string.Format("RoleList?CurrentPage=|pageIndex|&NumCount={0}", pageModel.NumCount);
            if (!string.IsNullOrWhiteSpace(pageModel.TitleName))
            {
                NewShowPager = NewShowPager + "&TitleName=" + pageModel.TitleName;
            }
            ViewBag.Page = CommonHelper.Pager(NewShowPager, pageModel.CurrentPage, allCount, pageModel.NumCount);
            return View(roleList);
        }
        public IActionResult RoleAddOrEdit()
        {
            string token = httpCommonHelper.GetToken();
            IQueryCollection queryParameters = HttpContext.Request.Query;
            long Id = Convert.ToInt64(queryParameters["Id"]);
            ViewBag.Id = Id;
            role = roleService.GetInfoById(Id);
            if (role == null)
            {
                role = new Role();
                role.Role_name = "";
                role.State = 1;
            }
            ViewBag.Role = role;
            //1.首先获取所有菜单 2.获取角色下菜单权限 3.有权限直接被选中
            List<Role_Menu> role_MenuList=role_MenuService.GetListByRoleId(role.Id);
            List<Menu> menuList = menuService.GetAllList();
            List<Menu> menuList1 = menuList.FindAll(e=>e.ParentId==0);
            List<Menu> menuList2 = menuList.FindAll(e => e.ParentId != 0).FindAll(e => e.IsLeaf == 0);
            List<Menu> menuList3 = menuList.FindAll(e => e.IsLeaf == 1);
            StringBuilder sbEnum = new StringBuilder();
            for (int x = 0; x < menuList1.Count; x++)//循环添加标项
            {
                sbEnum.Append("<td style='width:15%;'>");
                string c1 = role_MenuList.FindAll(e => e.MenuId == menuList1[x].Id).Count > 0? "checked":"";
                sbEnum.AppendFormat("<input class='selectMenu' type='checkbox' id='parent-{0}' {2}  name='parent' onclick=\"selectCheckBoxes('parent{0}')\"  value='{0}' lay-ignore /><label for='parent-{0}'>{1}</label>", menuList1[x].Id, menuList1[x].Name,c1);
                sbEnum.AppendFormat("</td><td><div  id='parent{0}'>", menuList1[x].Id);
                List<Menu> menuTree = menuList2.FindAll(e => e.ParentId == menuList1[x].Id);
                for (int xT = 0; xT < menuTree.Count; xT++)
                {
                    List<Menu> menuNode = menuList3.FindAll(e => e.ParentId == menuTree[xT].Id);
                    if(xT>0||xT!=menuTree.Count-1)
                    sbEnum.Append("<hr />");
                    string c2 = role_MenuList.FindAll(e => e.MenuId == menuTree[xT].Id).Count > 0 ? "checked" : "";
                    sbEnum.AppendFormat("<input class='selectMenu' type='checkbox' id='menu-{0}' {3}  name='menu' onclick=\"selectMenuBoxes('menu{0}','parent{2}','parent-{2}')\" value='{0}' lay-ignore /><label for='menu-{0}'>{1}</label>", menuTree[xT].Id, menuTree[xT].Name, menuList1[x].Id, c2);
                    sbEnum.AppendFormat("<div class='layui-input-block' id='menu{0}'>", menuTree[xT].Id);
                    for (int xN = 0; xN < menuNode.Count; xN++)
                    {
                        string c3 = role_MenuList.FindAll(e => e.MenuId == menuNode[xN].Id).Count > 0 ? "checked" : "";
                        sbEnum.Append(string.Format("<input class='selectMenu' type='checkbox'  {4}  id='point-{0}'  onclick=\"selectLastBoxes('parent-{2}','menu-{3}','parent{2}','menu{3}')\"  name='point' value='{0}' lay-ignore /><label for='point-{0}'>{1}</label>", menuNode[xN].Id, menuNode[xN].Name, menuList1[x].Id, menuTree[xT].Id,c3));
                    }
                    sbEnum.Append("</div>");
                }
                sbEnum.Append("</td></div>");
            }
                ViewBag.Point = sbEnum.ToString();
            return View();
        }
        [HttpPost]
        public IActionResult RoleSave(Role role)
        {
            bool b = false;
            if (role.Id > 0)
            {
                long x = roleService.Updata(role);
                if (x > 0)
                    b = true;
            }
            else
            {
                long x = roleService.AddNew(role);
                if (x > 0)
                    b = true;
            }
            if (b)//保存角色拥有的权限，先删除该角色所有权限，之后添加
            {
                //1.删除该角色所有权限
                role_MenuService.BatchDel(role.Id);
                if (!string.IsNullOrWhiteSpace(role.MenuIds))
                {
                    string[] menuIds = role.MenuIds.Split(',');
                    //2.添加权限先list后批量添加
                    List<Role_Menu> role_Menus = new List<Role_Menu>();
                    foreach (string menuId in menuIds)
                    {
                        Role_Menu role_Menu = new Role_Menu();
                        role_Menu.MenuId = Convert.ToInt64(menuId);
                        role_Menu.RoleId = role.Id;
                        role_Menu.State = 1;
                        role_Menu.Update_time = DateTime.Now;
                        role_Menu.Create_time = DateTime.Now;
                        role_Menus.Add(role_Menu);
                    }
                    role_MenuService.BatchAdd(role_Menus);
                }
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/RoleSave");
        }
        [HttpPost]
        public IActionResult RoleChangeStute(ChangeState changeState)
        {
            bool b = false;
            if (changeState.Id > 0)
            {
                long x = roleService.ChangeState(changeState);
                if (x > 0)
                    b = true;
            }
            return CommonHelper.GetJsonResult(b, "出错", "../PowerManager/RoleChangeStute");
        }
        #endregion


        public string TestJson()//测试
        {
            string ss = "{ \"msg\":\"true\",\"code\":0,\"data\":[{\"permissionId\":1,\"permissionName\":\"系统管理\",\"permissionUrl\":null,\"permissionType\":null,\"icon\":null,\"pid\":0,\"seq\":0,\"resType\":\"0\"},{\"permissionId\":2,\"permissionName\":\"账户管理\",\"permissionUrl\":\"/link/sysUsers\",\"permissionType\":\"管理登录的账户\",\"icon\":null,\"pid\":1,\"seq\":1,\"resType\":\"1\"},{\"permissionId\":3,\"permissionName\":\"部门管理\",\"permissionUrl\":\"/link/deparAdministrate\",\"permissionType\":\"部门的管理\",\"icon\":null,\"pid\":1,\"seq\":2,\"resType\":\"1\"},{\"permissionId\":4,\"permissionName\":\"角色管理\",\"permissionUrl\":\"/link/sysRoleManage\",\"permissionType\":\"设定角色的权限\",\"icon\":null,\"pid\":1,\"seq\":3,\"resType\":\"1\"},{\"permissionId\":5,\"permissionName\":\"权限管理\",\"permissionUrl\":\"/link/sysPermission\",\"permissionType\":\"对权限进行编辑\",\"icon\":null,\"pid\":1,\"seq\":4,\"resType\":\"1\"},{\"permissionId\":6,\"permissionName\":\"系统日志\",\"permissionUrl\":\"/link/sysLog\",\"permissionType\":\"系统日志\",\"icon\":null,\"pid\":1,\"seq\":5,\"resType\":\"1\"},{\"permissionId\":7,\"permissionName\":\"系统日志\",\"permissionUrl\":\"/link/sysLog\",\"permissionType\":\"系统日志\",\"icon\":null,\"pid\":6,\"seq\":1,\"resType\":\"1\"}],\"count\":6}";

            return ss;
        }
    }
}