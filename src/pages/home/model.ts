import { HOME } from "./../../constants/index";
import {
  REQUEST_LOGIN,
  ADD,
  FETCH_PAGEDATA,
  SET_PAGEDATA
} from "./../../constants/index";
import { fetchHomeData } from "../../services/homeService";
import Taro from "@tarojs/taro";

export default {
  namespace: HOME,
  state: {
    num: 1,
    homeItems: []
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    },
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchHomeData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },

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
    }
  }
};
