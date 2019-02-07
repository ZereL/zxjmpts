/*
 * @Author: Hank
 * @Date: 2019-02-07 10:08:02
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-07 11:57:15
 */
import {
  GOODSDETAIL,
  FETCH_PAGEDATA,
  SET_PAGEDATA
} from "./../../constants/index";
import { fetchGoodsData } from "../../services/goodsService";

export default {
  namespace: GOODSDETAIL,
  state: {
    num: 1,
    image: []
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
          ...requestResult.data
        }
      });

      return requestResult;
    }
  }
};
