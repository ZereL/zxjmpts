/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:53
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-08 09:23:13
 */
import { HOME } from "./../../constants/index";
import {
  ADD,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  FETCH_TAGLISTDATA
} from "./../../constants/index";
import { fetchHomeData, fetchTagListData } from "../../services/homeService";

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

    *[FETCH_TAGLISTDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchTagListData, payload);
      console.log("fetchTagListData", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: { tagList: requestResultData.items }
      });
      return requestResultData;
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
    }
  }
};
