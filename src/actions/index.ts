import { ADD, REQUEST_LOGIN } from '../constants/index';
import Action from "./actions";

// 公用action
export const add = (namespace: string, payload?: any) => Action(`${namespace}/${ADD}`, payload)

// home页面action
export const login = (namespace: string, payload?: any) => Action(`${namespace}/${REQUEST_LOGIN}`, payload)
