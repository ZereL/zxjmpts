import Taro, { Component, Config } from "@tarojs/taro";
import Home from "./pages/home/home";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import dva from "./utils/dva";
import models from "./models";
// import { setGlobalData } from "./utils/common";
import "./app.scss";

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
    pages: ["pages/home/home", "pages/cart/cart", "pages/user/user"],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/home/home",
          text: "首页",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        },
        {
          pagePath: "pages/cart/cart",
          text: "聚宝盆",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home.png"
        },
        {
          pagePath: "pages/user/user",
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
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
