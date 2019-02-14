/*
 * @Author: Hank
 * @Date: 2019-02-11 15:38:30
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-14 17:17:35
 */
import api from "./api";

/**
 * 获取用户token
 */
export function fetchUserData(payload) {
  return api.post({
    url: "/memberService/member/WechatMinLoginAndGetWechatInfo",
    payload: {
      WechatCode: payload.wechatCode,
      EncryptedData: payload.encryptedData,
      Iv: payload.iv
    }
  });
}

/**
 * 获取用户uid
 */
export function requestRegisterUid(payload) {
  return api.post({
    url: "/memberService/member/WechatMinLoginAndGetWechatInfo",
    payload: {
      WechatCode: payload.wechatCode,
      EncryptedData: payload.encryptedData,
      Iv: payload.iv
    }
  });
}

/**
 * requestRegisterWeChat
 */
export function requestRegisterWeChat(payload) {
  return api.post({
    url: "/memberService/member/registerByWechat",
    payload: {
      invatationCode : payload.invatationCode,
      uid: payload.uid,
      notLogin : payload.notLogin,
    }
  });
}

/**
 * 获取个人数据
 */
export const fetchUserInfo = () => {
  return api.post({
    url: "/memberService/member/current",
    payload: {}
  });
};
