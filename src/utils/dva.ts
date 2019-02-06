/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:52 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:52 
 */
import { create } from "dva-core";
import { createLogger } from "redux-logger";
import createLoading from "dva-loading";

let app;
let store;
let dispatch;
let registered;

function createApp(opt) {
  // redux日志
  opt.onAction = [createLogger()];
  app = create(opt);
  app.use(createLoading({}));

  // TODO：这个registered原本在global下，不知道Taro有没有global这个对象。
  if (!registered) opt.models.forEach(model => app.model(model));
  registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;
  app.use({
    onError(err) {
      console.log("Dva框架报错", err);
    }
  });

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  }
};
