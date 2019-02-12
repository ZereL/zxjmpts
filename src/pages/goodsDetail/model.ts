/*
 * @Author: Hank
 * @Date: 2019-02-07 10:08:02
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-12 13:00:26
 */
import {
  GOODSDETAIL,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  CLEAR_PAGEDATA,
  REQUEST_UPDATECART,
  SET_UPDATECART
} from "./../../constants/index";
import { fetchGoodsData } from "../../services/goodsService";
import { updateCart } from "../../services/cartService";

export default {
  namespace: GOODSDETAIL,
  state: {
    num: 1,
    image: [],
    contentImages: [],
    name: "",
    price: ""
  },
  reducers: {
    [SET_PAGEDATA](state, { payload }) {
      return { ...state, ...payload };
    },
    [SET_UPDATECART](state, { payload }) {
      return { ...state, ...payload };
    },
    [CLEAR_PAGEDATA](state, {}) {
      console.log("state", state);
      return {
        num: 1,
        image: [],
        contentImages: [],
        name: "",
        price: ""
      };
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
    },
    *[REQUEST_UPDATECART]({ payload }, { select, put, call }) {
      const requestResult = yield call(updateCart, payload);
      console.log("加入购物车成功", requestResult);

      yield put({
        type: SET_UPDATECART,
        payload: {
          ...requestResult.data
        }
      });

      return requestResult;
    }
  }
};
