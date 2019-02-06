/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-07 10:33:04
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login } from "../../actions";
import { CART } from "../../constants";

type PageStateProps = {
  cart: {
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

interface Cart {
  props: IProps;
}

@connect(
  ({ cart }) => ({
    cart
  }),
  {
    add: add,
    login: login
  }
)
class Cart extends Component {
  config: Config = {
    navigationBarTitleText: "聚宝盆"
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
      const result = await this.props.add(CART);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  goHome = () => {
    Taro.switchTab({
      url: '/pages/home/index',
    })
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    return (
      <View className="cart-page">
        <View className="empty">
          <View style="margin-top: 250px">购物车为空</View>
          <Button type="primary" className="am-button" onClick={this.goHome}>
            立即去框框
          </Button>
        </View>
      </View>
    );
  }
}

export default Cart as ComponentClass<PageOwnProps, PageState>;
