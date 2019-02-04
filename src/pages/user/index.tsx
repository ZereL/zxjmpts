import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login } from "../../actions";
import { USER } from "../../constants";

type PageStateProps = {
  user: {
    num: number;
  };
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface User {
  props: IProps;
}

@connect(
  ({ user }) => ({
    user
  }),
  {
    add: add,
    login: login
  }
)
class User extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "小主"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /********************* 事件handler **********************/
  add = async () => {
    try {
      const result = await this.props.add(USER);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * 登录
   */
  login = async () => {
    try {
      const result = await this.props.login(USER);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    return (
      <View className="index">
        <View>
          <Text>小主页面</Text>
        </View>
      </View>
    );
  }
}

export default User as ComponentClass<PageOwnProps, PageState>;
