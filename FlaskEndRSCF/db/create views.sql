create or replace view v_user_role_menu
as 
select m.MenuID, m.MenuName, m.Component, m.Path, m.Label, m.Icon,
    r.RoleID, r.RoleName, u.userID, u.UserName 
from role_permission rp, menu m, role r, user u 
where rp.MenuID = m.MenuID 
and rp.RoleID = r.RoleID 
and u.RoleID = r.RoleID 