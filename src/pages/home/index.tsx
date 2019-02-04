import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login } from "../../actions";
import { HOME } from "../../constants";

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

interface Home {
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
class Home extends Component {
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
  add = async () => {
    try {
      const result = await this.props.add(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * 登录
   */
  loginHandler = async () => {
    try {
      const result = await this.props.login(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  goGoodsDetailHandler = () => {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=1271`
    });
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    const { home } = this.props;
    return (
      <View className="index">
        <Button className="add_btn" onClick={this.add}>
          +
        </Button>
        <Button className="add_btn" onClick={this.loginHandler}>
          登录
        </Button>
        <Button className="add_btn" onClick={this.goGoodsDetailHandler}>
          查看商品详情
        </Button>
        <View>
          <Text>{home.num}</Text>
        </View>
        <View>
          <Text>首页</Text>
        </View>
      </View>
    );
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>;
