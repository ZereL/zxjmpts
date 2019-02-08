/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-08 17:28:57
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image， ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchMorePageData } from "../../actions";
import { GOODSLIST } from "../../constants";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  goodsList: {
    items: Array<object>;
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsList {
  props: IProps;
}

@connect(
  ({ goodsList }) => ({
    goodsList
  }),
  {
    fetchPageData: fetchPageData
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
class GoodsList extends Component {
  config: Config = {
    navigationBarTitleText: "首页"
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
      const result = await this.props.fetchPageData(GOODSLIST, {
        // pageSize: pageSize,
        // currentPage: currentPage + 1,
        // brandId: item.brandId ? item.brandId : null,
        // cateId: item.cateId ? item.cateId : null,
        // keyword: keyword
        pageSize: 14,
        currentPage: 1,
        // brandId: item.brandId ? item.brandId : null,
        // cateId: item.cateId ? item.cateId : null,
        keyword: "奶粉"
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize} = this.props.goodsList
     
    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData(GOODSLIST, {
          // pageSize: pageSize,
          // currentPage: currentPage + 1,
          // brandId: item.brandId ? item.brandId : null,
          // cateId: item.cateId ? item.cateId : null,
          // keyword: keyword
          pageSize: pageSize,
          currentPage: currentPage + 1,
          // brandId: item.brandId ? item.brandId : null,
          // cateId: item.cateId ? item.cateId : null,
          keyword: "奶粉"
        });
        console.log("请求成功", result);
      } else {
        console.log('没有更多了');
      }

    } catch (error) {
      console.log("error", error);
    }
  };

  onScrollToLower = () => {
    console.log('滑到底部');
  }
  // goGoodsDetailHandler = () => {
  //   Taro.navigateTo({
  //     url: `/pages/goodsDetail/index?id=1271`
  //   });
  // };

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { items } = this.props.goodsList;
    return (
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
        onScrollToLower = { this.onScrollToLower}
      >
        <ZXJGoodsList list={items}/>
      </ScrollView>
      // <View className="goodsList-page">

      //   <ZXJGoodsList list={items} />
      // </View>
    );
  }
}

export default GoodsList as ComponentClass<PageOwnProps, PageState>;
