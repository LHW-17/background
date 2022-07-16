//获取品牌管理相关数据
import request from "@/utils/request";
//GET /admin/product/baseTrademark/{page}/{limit}

export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

//处理添加品牌操作 新增
//修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "put",
      data: tradeMark,
    });
  } else {
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: tradeMark,
    });
  }
};
//删除品牌的接口
export const reqDeleteTradeMark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
