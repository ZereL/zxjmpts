import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./Home.scss";
import { add, login } from "../../actions";

type PageStateProps = {
  home: {
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

interface Index {
  props: IProps;
}

@connect(
  ({ home }) => ({
    home
  }),
  {
    add: add,
    login: login
  }
)
class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /********************* 事件handler **********************/
  add = async() => {
    try {
      const result = await this.props.add("home");
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
      const result = await this.props.login("home");
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    return (
      <View className="index">
        <Button className="add_btn" onClick={this.add}>
          +
        </Button>
        <Button className="add_btn" onClick={this.login}>
          登录
        </Button>
        <View>
          <Text>{this.props.home.num}</Text>
        </View>
        <View>
          <Text>{this.props.home.num}</Text>
          <Text>Hello, World</Text>
        </View>
      </View>
    );
  }
}


export default Index as ComponentClass<PageOwnProps, PageState>;
