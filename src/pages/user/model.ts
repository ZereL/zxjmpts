/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:01 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:01 
 */
import { REQUEST_LOGIN, ADD, USER } from './../../constants/index';
import { fetchHomeData } from "../../services/homeService";
import Taro from "@tarojs/taro";

export default {
  namespace: USER,
  state: {
    num: 1
  },
  reducers: {
    SetAdd(state, { payload }) {
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
    *[REQUEST_LOGIN]({ payload }, { }) {
      console.log("收到请求", payload);
      Taro.login().then(result => {
        console.log("result请求", result);
      });
    }
  }
};
