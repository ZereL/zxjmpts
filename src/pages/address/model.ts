/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:21
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 09:34:59
 */
import {
  CART,
  MODIFY_TEMP_CART_THEN_UPDATE,
  SET_CART_TEMP_DATA,
  SET_CART_LOCATION,
  FETCH_PAYMENTMETHODS,
  SET_FETCH_PAYMENTMETHODS
} from "../../constants";
import {
  REQUEST_LOGIN,
  ADD,
  FETCH_PAGEDATA,
  SET_PAGEDATA,
  REMOVE_FROM_CART,
  FETCH_CARTSUMMARY,
  SET_CARTSUMMARY
} from "./../../constants/index";
import Taro from "@tarojs/taro";
import {
  fetchCartData,
  modifyCart,
  removeFromCart,
  setLocationCode,
  getPaymentMethods
} from "../../services/cartService";
import { delay } from "redux-saga";

export default {
  namespace: "address",
  state: {
    
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    },
    // [SET_PAGEDATA](state, { payload }) {
    //   return { ...state, ...payload };
    // }
    [SET_PAGEDATA](state, { payload: payload }) {
      const data = payload.cateItemDetails || [];
      const warehouses = payload.warehouses || [];

      console.log("payload", payload);
      console.log("data", data, "warehouses", warehouses);

      // 初始化返回数据，临时状态
      data.forEach(item => {
        item.tmpQty = item.qty;
        item.tmpSelected = item.selected;
      });

      // 商品按照仓库号加入对应仓库
      warehouses.forEach(warehouse => {
        warehouse.data = data.filter(item => item.warehouseId == warehouse.id);
        warehouse.tmpTotalQty = warehouse.totalQty;
      });
      return {
        ...state,
        warehouses: warehouses,
        totalPriceWithoutTax: payload.totalPriceWithoutTax || 0,
        totalTax: payload.totalTax || 0,
        totalPrice: payload.totalPrice || 0
      };
    },
    // TODO: 这里需要修改
    [SET_CART_TEMP_DATA](state, { payload }) {
      let newState = state;
      console.log("payload", payload);
      if (payload.id == null) {
        if (payload.warehouseId == null) {
          // 全选切换
          newState.warehouses.forEach(warehouse => {
            warehouse.data.forEach(item => {
              item.tmpSelected = payload.selected;
            });
          });
        } else {
          // 仓库选中切换
          const { data } = newState.warehouses.find(
            warehouse => warehouse.id == payload.warehouseId
          );
          data.forEach(item => {
            item.tmpSelected = payload.selected;
          });
        }
      } else {
        let warehouse = newState.warehouses.find(
          warehouse => warehouse.id == payload.warehouseId
        );
        let item = warehouse.data.find(item => item.skuId == payload.id);
        console.log("item", item);
        item.tmpQty = payload.qty;
        item.tmpSelected = payload.selected;
        console.log("item.tmpQty", item.tmpQty);
      }

      console.log("newState", newState);

      return {
        state,
        ...newState
      };
    },
    [SET_FETCH_PAYMENTMETHODS](state, { payload }) {
      payload.forEach(method => (method.selected = false));
      // 默认选中第一种支付方式
      if (payload.length > 0) {
        payload[0].selected = true;
      }
      return {
        ...state,
        paymentMethods: payload
      };
    }
  },
  effects: {
    *[ADD]({ payload }, { select, put, call }) {
      console.log("收到请求", payload);
      const { num } = yield select(state => state.home);
      console.log("准备请求");
      const requestResult = yield call(fetchCartData);
      console.log("requestResult", requestResult);

      yield put({
        type: "SetAdd",
        payload: {
          num: num + 1
        }
      });

      return requestResult;
    },
    *[FETCH_PAGEDATA]({ payload }, { select, put, call }) {
      const requestResult = yield call(fetchCartData, payload);
      console.log("requestResult", requestResult);
      const requestResultData = requestResult.data;

      yield put({
        type: SET_PAGEDATA,
        payload: requestResultData
      });
      return requestResult;
    },
    *[REQUEST_LOGIN]({ payload }, {}) {
      console.log("收到请求", payload);
      Taro.login().then(result => {
        console.log("result请求", result);
      });
    },
    *[REMOVE_FROM_CART]({ payload }, { call, put, select }) {
      // TODO： 我去！！！ 上下换下位置就行了？？？
      console.log("进入删除");
      const result = yield call(removeFromCart, payload);
      console.log("result", result);
      const resultData = result.data;
      yield put({
        type: SET_PAGEDATA,
        payload: resultData
      });
    },
    *[FETCH_CARTSUMMARY]({ payload }, { call, put, select }) {
      console.log("进入删除");
      const result = yield call(removeFromCart, payload);
      console.log("result", result);
      const resultData = result.data;
      yield put({
        type: SET_CARTSUMMARY,
        payload: resultData
      });
    },
    *[SET_CART_LOCATION]({ payload }, { call, put, select }) {
      console.log("进入删除");
      const result = yield call(setLocationCode, payload);
      console.log("请求完成", result);
      const resultData = result.data;
      return resultData;
      // const resultData = result.data;
      // yield put({
      //   type: SET_CARTSUMMARY,
      //   payload: resultData
      // });

      // return yield select(state => state.cartsummary.data);
    },
    *[FETCH_PAYMENTMETHODS]({ payload }, { call, put, select }) {
      const result = yield call(getPaymentMethods, payload);
      const resultData = result.data;
      console.log("resultData", resultData);
      yield put({
        type: SET_FETCH_PAYMENTMETHODS,
        payload: resultData
      });

      return yield select(state => state.cart.paymentMethods);
    },
    // 这个方法使用takeLatest作为effect触发规则，所以仅会执行最后一次，之前的effect均会被取消
    [MODIFY_TEMP_CART_THEN_UPDATE]: [
      function*({ payload }, { call, put, select }) {
        console.log("进入payload", payload);

        // 更新临时数据，刷新界面
        yield put({
          type: SET_CART_TEMP_DATA,
          payload: payload
        });

        // 延迟0.5秒
        yield call(delay, 500);

        // 找出被修改的商品
        const { warehouses } = yield select(state => state.cart);
        console.log("warehouses", warehouses);
        let params: any = [];
        warehouses.forEach(warehouse => {
          warehouse.data.forEach(item => {
            // 不能比对item.qty != item.tmpQty || item.selected != item.tmpSelected，因为本地值可能与服务端已经不一致了
            // 所以相对服务端已经改变的值，相对本地未必改变
            params.push({
              skuId: item.skuId,
              qty: item.tmpQty,
              selected: item.tmpSelected
            });
          });
        });

        console.log("params", params);
        // 如果购物车没有任何状态改变则不发送更新请求
        if (params.length > 0) {
          // 执行更新购物车方法
          const result = yield call(modifyCart, params);
          const resultData = result.data;
          console.log("result", result);
          yield put({
            type: SET_PAGEDATA,
            payload: resultData
          });
        }
      },
      { type: "takeLatest" }
    ]
  }
};
