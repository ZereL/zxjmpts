/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-07 14:42:38
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTag, AtFloatLayout, AtRadio, AtButton } from "taro-ui";

import "./index.scss";
import { fetchPageData, fetchUserInfo, requestPayOrder } from "../../actions";
import { getGlobalData } from "../../utils/common";
import Card from "./Card";
// import Card from "../order/Card";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  requestPayOrder: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  order: {};
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Order {
  props: IProps;
}

@connect(
  ({ order }) => ({
    order
  }),
  {
    fetchPageData: fetchPageData,
    requestPayOrder: requestPayOrder
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  state = {
    topTags: [
      { title: "全部", onClick: () => {} },
      { title: "待付款", onClick: () => {} },
      { title: "待发货", onClick: () => {} },
      { title: "待收货", onClick: () => {} },
      { title: "已收货", onClick: () => {} }
    ],
    activeTagIndex: 0,
    isFloatLayoutShow: false,
    orderId: "",
    paymentMethod: "1"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.fetchPageData();
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("order", {
        // status: "canceled",
        // memberId: 0,
        // keyword: "string",
        currentPage: 1,
        pageSize: 15
        // sortBy: "string",
        // sortMode: 0
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  getCode = async () => {
    const result = await Taro.login();
    console.log("result", result);
  };

  // tagActiveHandler(index) {
  //   console.log("index", index);
  //   return true;
  //   // const { activeTagIndex } = this.state;
  //   // console.log("index", index, "activeTagIndex", activeTagIndex);
  //   // if (activeTagIndex == index) {
  //   //   return true;
  //   // } else {
  //   //   return false;
  //   // }
  // }

  tagClickHandler(index) {
    this.setState({ activeTagIndex: index });
  }

  async requestPayOrder() {
    const { orderId, paymentMethod } = this.state;
    try {
      if (paymentMethod == "1") {
        const payResult = await this.props.requestPayOrder("order", {
          // memberId: 0,
          orderId: orderId,
          paymentConfigId: paymentMethod
          // wechatCode: "string",
          // joinedPay: true
        });
        Taro.showToast({ title: "支付成功", icon: "none", duration: 2000 });
      } else if (paymentMethod == "3") {
        const wechatCode = await Taro.login();
        const payResult = await this.props.requestPayOrder("order", {
          // memberId: 0,
          orderId: orderId,
          paymentConfigId: paymentMethod,
          wechatCode: wechatCode.code,
          joinedPay: false
        });
        console.log("payResult", payResult);
        const { payUrl } = payResult;
        Taro.requestPayment({
          timeStamp: payUrl.timeStamp,
          nonceStr: payUrl.nonceStr,
          package: payUrl.package,
          signType: payUrl.signType,
          paySign: payUrl.paySign
        })
          .then(res => {
            console.log("res", res);
            Taro.showToast({ title: "支付成功", icon: "none", duration: 2000 });
          })
          .catch(res => {
            console.log("res", res);
            Taro.showToast({ title: "支付失败", icon: "none", duration: 2000 });
          });
      }
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
      Taro.showToast({ title: error.message, icon: "none", duration: 2000 });
    }
  }

  showFloatLayout(id) {
    this.setState({ orderId: id, isFloatLayoutShow: true });
    console.log("this.state", this.state);
  }

  floatLayoutCloseHandler = () => {
    this.setState({ isFloatLayoutShow: false });
  };

  changePaymentMethodHandler(paymentMethod) {
    this.setState({ paymentMethod });
  }

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    const { items = [] } = this.props.order;
    const { topTags, activeTagIndex } = this.state;
    console.log("this.props", this.props);
    console.log("items", items);
    return (
      <View className="order-page">
        <View>
          <View>我的订单</View>
          <View className="top-tags">
            {topTags.map((item, index) => {
              return (
                <AtTag
                  key={index}
                  className="tags"
                  type="primary"
                  active={activeTagIndex == index ? true : false}
                  onClick={this.tagClickHandler.bind(this, index)}
                >
                  {item.title}
                </AtTag>
              );
            })}
          </View>
          <ScrollView>
            {items.map((item, index) => {
              // console.log("item", item);
              // return <View>123</View>;
              return (
                <Card
                  key={index}
                  item={item}
                  onRequestPayOrder={this.showFloatLayout}
                />
              );
            })}
          </ScrollView>
        </View>
        <AtFloatLayout
          isOpened={this.state.isFloatLayoutShow}
          onClose={this.floatLayoutCloseHandler}
        >
          <AtRadio
            options={[
              { label: "臻金", value: "1" },
              { label: "微信", value: "3" }
            ]}
            value={this.state.paymentMethod}
            onClick={this.changePaymentMethodHandler.bind(this)}
          />
          <AtButton onClick={this.requestPayOrder}>支付</AtButton>
        </AtFloatLayout>
      </View>
    );
  }
}

export default Order as ComponentClass<PageOwnProps, PageState>;
