/*
 * @Author: Hank
 * @Date: 2019-02-07 10:10:01
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-25 14:59:55
 */
import {
  REQUEST_LOGIN,
  ADD,
  USER,
  FETCH_USERTOKEN,
  SET_USERTOKEN,
  FETCH_USERINFO,
  SET_USERINFO,
  FETCH_INVITATIONCODE
} from "./../../constants/index";
import { fetchHomeData } from "../../services/homeService";
import {
  fetchUserData,
  fetchUserInfo,
  fetchInvitationCode
} from "../../services/memberService";
import Taro from "@tarojs/taro";

export default {
  namespace: USER,
  state: {
    num: 1
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    },
    // 把后台返回的token和用户名存入redux
    [SET_USERTOKEN](state, { payload }) {
      return { ...state, ...payload };
    },
    // 把后台返回的用户完整信息写入redux
    [SET_USERINFO](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[ADD]({ payload }, { select, put, call }) {
      console.log("收到请求", payload);
      const { num } = yield select(state => state.home);
      console.log("准备请求");
      const requestResult = yield call(fetchHomeData);
      console.log("requestResult", requestResult);

      yield put({
        type: "SetAdd",
        payload: {
          num: num + 1
        }
      });

      return requestResult;
    },
    *[REQUEST_LOGIN]({ payload }, {}) {
      console.log("收到请求", payload);
      Taro.login().then(result => {
        console.log("result请求", result);
      });
    },
    *[FETCH_USERTOKEN]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchUserData, payload);
      console.log("requestResult", requestResult);

      yield put({
        type: SET_USERTOKEN,
        payload: requestResult.data
      });

      return requestResult;
    },
    *[FETCH_INVITATIONCODE]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchInvitationCode, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;
      yield put({
        type: SET_USERINFO,
        payload: requestResultData
      });

      return requestResultData;
    },
    *[FETCH_USERINFO]({ payload }, { select, put, call }) {
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
