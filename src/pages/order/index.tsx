/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-21 16:33:45
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTag } from "taro-ui";

import "./index.scss";
import { fetchPageData, fetchUserInfo } from "../../actions";
import { getGlobalData } from "../../utils/common";
import Card from "./Card";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
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
    fetchPageData: fetchPageData
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
class Order extends Component {
  config: Config = {
    navigationBarTitleText: "首页"
  };
  state = {
    topTags: [
      { title: "全部", onClick: () => {} },
      { title: "待付款", onClick: () => {} },
      { title: "待发货", onClick: () => {} },
      { title: "待收货", onClick: () => {} },
      { title: "已收货", onClick: () => {} }
    ],
    activeTagIndex: 0
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

  requestPayOrder(id) {
    console.log("id", id);
    // this.props.requestPayOrder('order', {

    // })
  }

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    const { items } = this.props.order;
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
              console.log("item", item);
              return (
                <View>123</View>
              )
              // return (
              //   <Card
              //     item={item}
              //     requestPayOrder={this.requestPayOrder.bind(this)}
              //   />
              // );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Order as ComponentClass<PageOwnProps, PageState>;
