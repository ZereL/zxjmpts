/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-08 16:59:04
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData } from "../../actions";
import { GOODSLIST } from "../../constants";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
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
      <View className="goodsList-page">
        <ZXJGoodsList list={items} isGoodsListPage={true} />
      </View>
    );
  }
}

export default GoodsList as ComponentClass<PageOwnProps, PageState>;
