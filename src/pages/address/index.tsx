/*
 * @Author: Hank
 * @Date: 2019-02-19 17:37:31
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 12:52:54
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, ScrollView, Picker } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  fetchPageData,
  fetchMorePageData,
  requestSetDefaultAddress
} from "../../actions";
import { getGlobalData } from "../../utils/common";
import locations from "../../assets/locations.js";
import { AtButton } from "taro-ui";

type PageStateProps = { address: {} };

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
  requestSetDefaultAddress: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Address {
  props: IProps;
}

const windowHeight = getGlobalData("systemInfo").windowHeight;

@connect(
  ({ address }) => ({
    address
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData,
    requestSetDefaultAddress: requestSetDefaultAddress
  }
)
class Address extends Component {
  config: Config = {
    navigationBarTitleText: "我的收件人"
  };

  state = {};

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (getGlobalData("token")) {
      this.fetchPageData();
    } else {
      Taro.showToast({ title: "尚未登录", icon: "none", duration: 2000 });
    }
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("address", {
        pageSize: 14,
        currentPage: 1
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize } = this.props.address;
    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData("address", {
          pageSize: 14,
          currentPage: currentPage + 1
        });
        console.log("请求成功", result);
      } else {
        console.log("没有更多了");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  setDefaltHandler = e => {
    console.log("e.currentTarget.dataset.info", e.currentTarget.dataset.info);
    console.log("设置默认地址");
    const {
      name,
      phoneNum,
      enCodeFullName,
      detailAddress,
      idNum,
      id
    } = e.currentTarget.dataset.info;
    // this.props.requestSetDefaultAddress("address", {});
    // let { info } = this.$router.params; //获取分享进来的参数share
    Taro.navigateTo({
      url: `/pages/addressUpdate/index?name=${name}&phoneNum=${phoneNum}&enCodeFullName=${enCodeFullName}&detailAddress=${detailAddress}&idNum=${idNum}&addressId=${id}`
    });
  };

  addNewAddressHandler = () => {
    Taro.navigateTo({ url: "/pages/addressUpdate/index" });
  };

  goHome = () => {
    Taro.switchTab({
      url: "/pages/home/index"
    });
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { items = [] } = this.props.address;
    console.log("locations", locations);
    return (
      <View className="address-page">
        {" "}
        <ScrollView
          className="scrollview"
          scrollY
          scrollWithAnimation
          // scrollTop="0"
          style={`height: ${windowHeight - 30}px`}
          lowerThreshold={20}
          // upperThreshold="20"
          // onScrolltoupper={this.onScrolltoupper}
          // onScroll={this.onScroll}
          onScrollToLower={this.fetchMorePageData}
        >
          {items.map((item, index) => {
            const {
              name,
              phoneNum,
              enCodeFullName,
              detailAddress,
              idNum,
              id
            } = item;
            return (
              <View
                className="goods-row"
                data-info={{
                  name,
                  phoneNum,
                  enCodeFullName,
                  detailAddress,
                  idNum,
                  id
                }}
                onClick={this.setDefaltHandler}
              >
                <View className="">
                  {name}, {phoneNum}
                </View>
                <View className="">
                  {enCodeFullName}, {detailAddress}
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View className="bottom-view">
          <Button className="bottom-button" onClick={this.addNewAddressHandler}>
            添加新地址
          </Button>
        </View>
      </View>
    );
  }
}

export default Address as ComponentClass<PageOwnProps, PageState>;
