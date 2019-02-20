/*
 * @Author: Hank
 * @Date: 2019-02-19 17:37:31
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 11:16:37
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, ScrollView, Picker } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData } from "../../actions";
import { CART } from "../../constants";
import { getGlobalData } from "../../utils/common";
import locations from "../../assets/locations.js";
import AddressPicker from "../../components/AddressPicker";

type PageStateProps = { address: {} };

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Address {
  props: IProps;
}

@connect(
  ({ address }) => ({
    address
  }),
  {
    fetchPageData: fetchPageData
  }
)
class Address extends Component {
  config: Config = {
    navigationBarTitleText: "编辑收件人"
  };

  state = {
    selector: [["a", "b"], ["c", "d"]],
    selectorChecked: "a"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    // if (getGlobalData("token")) {
    //   this.fetchPageData();
    // } else {
    //   Taro.showToast({ title: "尚未登录", icon: "none", duration: 2000 });
    // }
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    });
  };
  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    });
  };
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    });
  };

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("cart");
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  goHome = () => {
    Taro.switchTab({
      url: "/pages/home/index"
    });
  };

  checkOutHandler = () => {
    // console.log("合计");
    Taro.navigateTo({ url: "/pages/cart/cartSummary" });
  };
  onToggleAddressPicker = info => {
    console.log("点击", this);
    console.log("点击", info);
  };
  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    // const {} = this.props.address;
    console.log("locations", locations);
    return (
      <View className="cart-page">
        <View>添加地址</View>
        {/* <Picker
          mode="multiSelector"
          range={this.state.selector}
          onChange={this.onChange}
        >
          <View className="picker">当前选择：{this.state.selectorChecked}</View>
        </Picker> */}
        <AddressPicker
          pickerShow={true}
          onHandleToggleShow={this.onToggleAddressPicker.bind(this)}
        />
      </View>
    );
  }
}

export default Address as ComponentClass<PageOwnProps, PageState>;
