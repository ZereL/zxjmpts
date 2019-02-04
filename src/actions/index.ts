import { ADD, REQUEST_LOGIN, FETCH_PAGEDATA } from '../constants/index';
import Action from "./actions";

// 公用action
export const add = (namespace: string, payload?: any) => Action(`${namespace}/${ADD}`, payload)

// 公用action
export const fetchPageData = (namespace: string, payload?: any) => Action(`${namespace}/${FETCH_PAGEDATA}`, payload)

// home页面action
export const login = (namespace: string, payload?: any) => Action(`${namespace}/${REQUEST_LOGIN}`, payload)
