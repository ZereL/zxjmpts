/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-21 17:17:14
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button, ScrollView, Text } from "@tarojs/components";
import { AtTag, AtDivider } from "taro-ui";

import "./index.scss";
import { IMAGE_URL } from "../../../config/index";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = {
  item: any;
  requestPayOrder: any;
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Card {
  props: IProps;
}

// TODO: 研究代替switch case遍历homeItems数组的办法
class Card extends Component {
  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  /********************* 事件handler **********************/
  payOrderHandler(id) {
    console.log("订单Id", id);
    console.log("this.props", this.props);
    // this.props.requestPayOrder();
    // return id;
  }
  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    const { createTime, id, items, price, statusSummary } = this.props.item;
    // console.log("this.props.item", this.props.item);
    // console.log("this.props", this.props);
    // console.log("this", this);
    return (
      <View className="card">
        <View className="card-title">
          {/* <View>{new Date(createTime).format("yyyy-MM-dd  hh:mm")}</View> */}
          <View>{new Date(createTime).toLocaleString()}</View>
          <View>{statusSummary.text}</View>
        </View>
        <View className="card-top">
          {items.map((item, index) => {
            return (
              <View className="card-item" key={index}>
                <Image
                  mode="aspectFit"
                  style="width: 80px;height: 80px;background: #fff;" // TODO: 这里为什么使用className就改变不了样式？？？？？？？
                  // className="img"
                  src={
                    item.image
                      ? `${IMAGE_URL}${
                          item.image
                        }?width=300&constrain=true&bgcolor=white`
                      : ""
                  }
                />
                <View className="item-name">{item.name}</View>
                <View className="item-detail">
                  <Text>{item.itemPrice}</Text>
                  <Text>x {item.qty}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <AtDivider content="" />
        <View className="card-bottom">
          <View>应付款{price.total}</View>
          <View>（含运费：{price.delivery}）</View>
          <View>付款</View>
        </View>
        <AtDivider content="" customStyle="height:5px" />
      </View>
    );
  }
}

export default Card as ComponentClass<PageOwnProps, PageState>;
