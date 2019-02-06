/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:48 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:48 
 */
import Taro from "@tarojs/taro";

/**
 * 储存数据到本地
 * @param key
 * @param value
 */
export function setCacheData(key: string, value: any) {
  Taro.setStorageSync(key, value);
}

/**
 * 读取本地数据
 * @param key
 */
export function getCacheData(key: string) {
  return Taro.getStorageSync(key);
}

// 设置一个全局变量
const globalData: object = {};

/**
 * 给全局变量赋值
 * @param key 
 * @param value 
 */
export function setGlobalData(key: string, value: any) {
  globalData[key] = value;
}

/**
 * 读取全局变量
 * @param key 
 */
export function getGlobalData(key: string) {
  return globalData[key];
}
