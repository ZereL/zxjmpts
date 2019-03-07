/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 09:22:32
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchMorePageData, fetchUserInfo } from "../../actions";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  shopkeeper: {
    items: Array<object>;
    currentPage: number;
    hasNext: boolean;
    pageSize: number;
  };
  user: any;
  home: any;
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Shopkeeper {
  props: IProps;
}

@connect(
  ({ shopkeeper, user, home }) => ({
    shopkeeper,
    user,
    home
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData,
    fetchUserInfo: fetchUserInfo
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
// TODO: 分页加载的时候显示加载中
class Shopkeeper extends Component {
  config: Config = {
    navigationBarTitleText: "金主有礼"
  };

  state = {
    isShareModalshow: false
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
      const result = await this.props.fetchPageData("shopkeeper", {
        pageSize: 14,
        currentPage: 1
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize } = this.props.shopkeeper;

    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData("shopkeeper", {
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

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { items = [] } = this.props.shopkeeper;
    const { tagList = [] } = this.props.home;
    // const { id } = this.props.user;
    // let share = this.$router.params.share; //获取分享进来的参数share
    let { avatarImage } = this.$router.params; //获取分享进来的参数share
    console.log("params", this.$router.params);
    console.log("avatarImage", avatarImage);
    return (
      <View className="shopkeeper-page">
        <ScrollView
          className="scrollview"
          scrollY
          scrollWithAnimation
          // scrollTop="0"
          style="height: 600px"
          lowerThreshold={20}
          // upperThreshold="20"
          // onScrolltoupper={this.onScrolltoupper}
          // onScroll={this.onScroll}
          onScrollToLower={this.fetchMorePageData}
        >
          <ZXJGoodsList list={items} tagList={tagList} />
        </ScrollView>
      </View>
    );
  }
}

export default Shopkeeper as ComponentClass<PageOwnProps, PageState>;
