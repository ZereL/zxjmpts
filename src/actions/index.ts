/*
 * @Author: Hank
 * @Date: 2019-02-07 10:08:38
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-22 11:08:22
 */

 // TODO: 这些Action需要整理复用。
import {
  ADD,
  REQUEST_LOGIN,
  FETCH_PAGEDATA,
  CLEAR_PAGEDATA,
  FETCH_MOREPAGEDATA,
  FETCH_USERTOKEN,
  FETCH_USERINFO,
  REQUEST_UPDATECART,
  REQUEST_REGISTERUID,
  REQUEST_REGISTERWECHAT,
  MODIFY_TEMP_CART_THEN_UPDATE,
  REMOVE_FROM_CART,
  FETCH_CARTSUMMARY,
  SET_CART_LOCATION,
  FETCH_PAYMENTMETHODS,
  REQUEST_ADDADDRESS,
  FETCH_CARTADDRESS,
  REQUEST_CREATEORDER,
  REQUEST_PAYORDER
} from "../constants/index";
import Action from "./actions";

// 公用action
export const add = (namespace: string, payload?: any) =>
  Action(`${namespace}/${ADD}`, payload);

// 公用action
export const fetchPageData = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_PAGEDATA}`, payload);

// 公用action
export const fetchMorePageData = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_MOREPAGEDATA}`, payload);

// 公用action
export const clearPageData = (namespace: string, payload?: any) =>
  Action(`${namespace}/${CLEAR_PAGEDATA}`, payload);

// 公用action
export const fetchUserToken = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_USERTOKEN}`, payload);

// User页面Action
export const fetchUserInfo = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_USERINFO}`, payload);

// home页面action
export const login = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_LOGIN}`, payload);

// cart页面action
export const requestUpdateCart = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_UPDATECART}`, payload);

export const modifyCart = (namespace: string, payload?: any) =>
  Action(`${namespace}/${MODIFY_TEMP_CART_THEN_UPDATE}`, payload);

export const removeFromCart = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REMOVE_FROM_CART}`, payload);

export const fetchCartSummary = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_CARTSUMMARY}`, payload);

export const setCartLocation = (namespace: string, payload?: any) =>
  Action(`${namespace}/${SET_CART_LOCATION}`, payload);

export const fetchPaymentMethod = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_PAYMENTMETHODS}`, payload);

export const requestCreateOrder = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_CREATEORDER}`, payload);

// 未登录金主页面action
export const requestRegisterUid = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_REGISTERUID}`, payload);

// 未登录金主页面action
export const requestRegisterWechat = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_REGISTERWECHAT}`, payload);

// 地址页面
export const requestAddAddress = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_ADDADDRESS}`, payload);
  
export const fetchCartAddress = (namespace: string, payload?: any) =>
  Action(`${namespace}/${FETCH_CARTADDRESS}`, payload);

  // order页面
export const requestPayOrder = (namespace: string, payload?: any) =>
  Action(`${namespace}/${REQUEST_PAYORDER}`, payload);



