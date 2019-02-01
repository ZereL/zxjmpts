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

      yield put({
        type: "SetAdd",
        payload: {
          num: num + 1
        }
      });
    }
  }
};
