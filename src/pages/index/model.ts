import { fetchHomeData } from "../../services/homeService";

export default {
  namespace: "home",
  state: {
    num: 1
  },
  reducers: {
    SetAdd(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *add({ payload }, { select, put, call }) {
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
