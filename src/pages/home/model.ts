/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:53
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-07 15:43:17
 */
import { HOME } from "./../../constants/index";
import {
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
    *[FETCH_PAGEDATA]({ payload }, { put, call }) {
      const requestResult = yield call(fetchHomeData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },

    *[FETCH_TAGLISTDATA]({ payload }, { put, call }) {
      const requestResult = yield call(fetchTagListData, payload);
      console.log("fetchTagListData", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: { tagList: requestResultData.items }
      });
      return requestResultData;
    }
  }
};
