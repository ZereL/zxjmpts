/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:08:38 
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-11 17:28:05
 */
import { ADD, REQUEST_LOGIN, FETCH_PAGEDATA, CLEAR_PAGEDATA, FETCH_MOREPAGEDATA, FETCH_USERTOKEN, FETCH_USERINFO } from '../constants/index';
import Action from "./actions";

// 公用action
export const add = (namespace: string, payload?: any) => Action(`${namespace}/${ADD}`, payload)

// 公用action
export const fetchPageData = (namespace: string, payload?: any) => Action(`${namespace}/${FETCH_PAGEDATA}`, payload)

// 公用action
export const fetchMorePageData = (namespace: string, payload?: any) => Action(`${namespace}/${FETCH_MOREPAGEDATA}`, payload)

// 公用action
export const clearPageData = (namespace: string, payload?: any) => Action(`${namespace}/${CLEAR_PAGEDATA}`, payload)

// 公用action
export const fetchUserToken = (namespace: string, payload?: any) => Action(`${namespace}/${FETCH_USERTOKEN}`, payload)
export const fetchUserInfo = (namespace: string, payload?: any) => Action(`${namespace}/${FETCH_USERINFO}`, payload)

// home页面action
export const login = (namespace: string, payload?: any) => Action(`${namespace}/${REQUEST_LOGIN}`, payload)
