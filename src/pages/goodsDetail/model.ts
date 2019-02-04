import {  GOODSDETAIL, FETCH_PAGEDATA, SET_PAGEDATA } from "./../../constants/index";
import { fetchGoodsData } from "../../services/goodsServices";

export default {
  namespace: GOODSDETAIL,
  state: {
    num: 1
  },
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {

      const requestResult = yield call(fetchGoodsData, payload);
      console.log("requestResult", requestResult);

      yield put({
        type: SET_PAGEDATA,
        payload: {
          requestResult
        }
      });

      return requestResult;
    }
  }
};
