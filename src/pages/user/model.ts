/*
 * @Author: Hank
 * @Date: 2019-02-07 10:10:01
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 10:28:44
 */
import {
  REQUEST_LOGIN,
  FETCH_USERTOKEN,
  SET_USERTOKEN,
  FETCH_USERINFO,
  SET_USERINFO,
  FETCH_INVITATIONCODE,
  CLEAR_PAGEDATA
} from "./../../constants/index";
import {
  fetchUserData,
  fetchUserInfo,
  fetchInvitationCode
} from "../../services/memberService";
import Taro from "@tarojs/taro";

export default {
  namespace: "user",
  state: {},
  reducers: {
    // 把后台返回的token和用户名存入redux
    [SET_USERTOKEN](state, { payload }) {
      return { ...state, ...payload };
    },
    // 把后台返回的用户完整信息写入redux
    [SET_USERINFO](state, { payload }) {
      return { ...state, ...payload };
    },
    [CLEAR_PAGEDATA](state, {}) {
      console.log("state", state);
      return {
        name: ""
      };
    }
  },
  effects: {
    *[REQUEST_LOGIN]({ payload }, {}) {
      console.log("收到请求", payload);
      Taro.login().then(result => {
        console.log("result请求", result);
      });
    },
    *[FETCH_USERTOKEN]({ payload }, { put, call }) {
      const requestResult = yield call(fetchUserData, payload);
      console.log("requestResult", requestResult);

      yield put({
        type: SET_USERTOKEN,
        payload: requestResult.data
      });

      return requestResult;
    },
    *[FETCH_INVITATIONCODE]({ payload }, { put, call }) {
      const requestResult = yield call(fetchInvitationCode, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;
      yield put({
        type: SET_USERINFO,
        payload: requestResultData
      });

      return requestResultData;
    },
    *[FETCH_USERINFO]({ payload }, { put, call }) {
      const requestResult = yield call(fetchUserInfo, payload);
      console.log("requestResult", requestResult);

      yield put({
        type: SET_USERINFO,
        payload: requestResult.data
      });

      return requestResult;
    }
  }
};
