/*
 * @Author: Hank
 * @Date: 2019-02-07 10:11:03
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-12 15:54:22
 */

import Taro, { Component, Config } from "@tarojs/taro";
import Home from "./pages/home";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import dva from "./utils/dva";
import models from "./models";
// import { setGlobalData } from "./utils/common";
import "./app.scss";
import "taro-ui/dist/style/index.scss";
import { setGlobalData } from "./utils/common";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models
});
const store = dvaApp.getStore(); //  getStore是一个函数！！！要执行！！！

class App extends Component {
  config: Config = {
    pages: [
      "pages/home/index",
      "pages/cart/index",
      "pages/user/index",
      "pages/goodsDetail/index",
      "pages/search/index",
      "pages/goodsList/index",
      "pages/notLoginShopkeeper/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/home/index",
          text: "首页",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        },
        {
          pagePath: "pages/cart/index",
          text: "聚宝盆",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        },
        {
          pagePath: "pages/user/index",
          text: "我的",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        }
      ],
      color: "#333",
      selectedColor: "#333",
      backgroundColor: "white",
      borderStyle: "white"
    }
  };

  async componentDidMount() {
    // setGlobalData('isLogin', true)
    const token = Taro.getStorageSync("token");
    setGlobalData("token", token);
    setGlobalData("systemInfo", Taro.getSystemInfoSync());
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home home={store.home} />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
