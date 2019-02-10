/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:38
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-11 09:50:32
 */

import { GOODSLIST } from "./../../constants/index";
import {
  ADD,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  FETCH_MOREPAGEDATA
} from "./../../constants/index";
import { fetchGoodsListData } from "../../services/goodsService";

export default {
  namespace: GOODSLIST,
  state: {
    num: 1,
    homeItems: []
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    },
    [SET_PAGEDATA](state, { payload }) {
      console.log("SET_PAGEDATA, payload", payload);
      return { ...state, ...payload };
    }
  },
  effects: {
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchGoodsListData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[FETCH_MOREPAGEDATA]({ payload }, { select, put, call }) {
      // 当前列表数据
      const currentState = yield select(state => state.goodsList);
      // console.log("currentState", currentState);
      const currentList = currentState.items;

      // 请求返回所有数据
      const requestResult = yield call(fetchGoodsListData, payload);
      console.log("requestResult", requestResult);
      // 请求返回的data
      const requestResultData = requestResult.data;
      // 请求返回的产品列表
      const fetchlist = requestResult.data.items;
      // 新的产品列表数据
      const newList = currentList.concat(fetchlist);
      console.log("newList", newList);

      yield put({
        type: SET_PAGEDATA,
        payload: {
          ...currentState,
          ...requestResultData,
          items: newList
        }
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
    }
  }
};
