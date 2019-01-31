export default {
  namespace: "home",
  state: {
    num: 1
  },
  reducers: {},
  effects: {
    *add({ payload }, { put, call }) {
      console.log("收到请求");
    }
  }
};
