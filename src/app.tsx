/*
 * @Author: Hank
 * @Date: 2019-02-07 10:11:03
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-06 10:09:50
 */

import Taro, { Component, Config } from "@tarojs/taro";
import Home from "./pages/home";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import dva from "./utils/dva";
import models from "./models";
// import { setGlobalData } from "./utils/common";
import "./app.scss";
// import "taro-ui/dist/style/index.scss";
import { setGlobalData } from "./utils/common";
import "./config/taroUIVariables.scss";

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
      // "pages/cart/cartSummary",
      "pages/cartSummary/index",
      "pages/address/index",
      "pages/addressUpdate/index",
      "pages/user/index",
      "pages/goodsDetail/index",
      "pages/search/index",
      "pages/goodsList/index",
      "pages/notLoginShopkeeper/index",
      // "pages/becomeShopkeeper/index",
      "pages/shopkeeper/index",
      "pages/order/index"
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
          pagePath: "pages/shopkeeper/index",
          text: "金主",
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
          text: "小主",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        }
      ],
      color: "#333",
      selectedColor: "#333",
      backgroundColor: "#FFFFFF",
      borderStyle: "white"
    }
  };

  async componentDidMount() {
    const token = Taro.getStorageSync("token");
    console.log("app.ts中的token", token);

    // 如果token为空， globalData中就是空字符串
    setGlobalData("token", token);
    setGlobalData("systemInfo", Taro.getSystemInfoSync());

    // console.log("Taro.getSystemInfoSync()", Taro.getSystemInfoSync());
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
