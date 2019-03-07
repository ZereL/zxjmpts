/*
 * @Author: Hank
 * @Date: 2019-02-19 17:37:31
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-07 15:58:10
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  fetchPageData,
  fetchMorePageData,
  requestDeleteAddress
} from "../../actions";
import { getGlobalData } from "../../utils/common";

type PageStateProps = { address: any };

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
  requestDeleteAddress: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Address {
  props: IProps;
}

const windowHeight = getGlobalData("systemInfo").windowHeight;
// const windowWidth = getGlobalData("systemInfo").windowWidth;

@connect(
  ({ address }) => ({
    address
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData,
    requestDeleteAddress: requestDeleteAddress
  }
)
class Address extends Component {
  config: Config = {
    navigationBarTitleText: "我的收件人"
  };

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

  /**
   * 请求页面数据
   */
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

  /**
   * 上拉加载
   */
  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize } = this.props.address;
    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData("address", {
          pageSize: pageSize,
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

  /**
   * 设置默认地址
   */
  setDefaltHandler = e => {
    const {
      name,
      phoneNum,
      enCodeFullName,
      detailAddress,
      idNum,
      id
    } = e.currentTarget.dataset.info;

    Taro.navigateTo({
      url: `/pages/addressUpdate/index?name=${name}&phoneNum=${phoneNum}&enCodeFullName=${enCodeFullName}&detailAddress=${detailAddress}&idNum=${idNum}&addressId=${id}`
    });
  };

  /**
   * 跳转到编辑收件人页面
   */
  addNewAddressHandler = () => {
    Taro.navigateTo({ url: "/pages/addressUpdate/index" });
  };

  /**
   * 删除地址
   */
  deleteHandler = async e => {
    Taro.showLoading({ title: "删除中...", mask: true });
    await this.props.requestDeleteAddress("address", {
      id: e.currentTarget.dataset.id
    });
    Taro.hideLoading();
    // 删除选定地址，重新加载数据
    this.fetchPageData();
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    const { items = [] } = this.props.address;
    return (
      <View className="address-page">
        <ScrollView
          className="scrollview"
          scrollY
          scrollWithAnimation
          // scrollTop="0"
          style={`height: ${windowHeight - 30}px`}
          lowerThreshold={20}
          // onScrolltoupper={this.onScrolltoupper}
          // onScroll={this.onScroll}
          onScrollToLower={this.fetchMorePageData}
        >
          {/* 循环加载地址信息 */}
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
              <View className="goods-row" key={index}>
                <View className="top-row">
                  <View
                    style={`width: 90%`}
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
                    {name}, {phoneNum}
                  </View>
                  <View
                    className="iconfont icon-delete"
                    style={"width: 5%"}
                    data-id={id}
                    onClick={this.deleteHandler.bind(this)}
                  />
                </View>
                <View
                  className=""
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
                  {enCodeFullName}, {detailAddress}
                </View>
              </View>
            );
          })}
        </ScrollView>
        {/* 底部新增地址按钮 */}
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
