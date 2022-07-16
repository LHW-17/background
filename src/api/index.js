//统一暴露接口函数
import * as trademark from "./product/tradeMark";
import * as attr from "./product/Attr";
import * as sku from "./product/Sku";
import * as spu from "./product/Spu";
import * as user from "./acl/user";
import * as role from "./acl/role";
import * as permission from "./acl/permission";
export default {
  trademark,
  sku,
  spu,
  attr,
  user,
  role,
  permission,
};
