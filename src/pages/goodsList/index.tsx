/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 09:54:11
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchMorePageData, clearPageData } from "../../actions";
import { GOODSLIST } from "../../constants";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
  clearPageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  goodsList: {
    items: Array<object>;
    currentPage: number;
    hasNext: boolean;
    pageSize: number;
  };
  home: { tagList: Array<object> };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsList {
  props: IProps;
}

@connect(
  ({ goodsList, home }) => ({
    goodsList,
    home
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData,
    clearPageData: clearPageData
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
// TODO: 分页加载的时候显示加载中
class GoodsList extends Component {
  config: Config = {
    navigationBarTitleText: "产品分类"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {
    this.props.clearPageData('goodsList')
  }

  componentDidShow() {
    this.fetchPageData();
  }

  componentDidHide() {
    // TODO：清除数据
    this.props.clearPageData('goodsList')
  }

  /********************* 事件handler **********************/

  /**
   * 请求页面展示数据
   */
  fetchPageData = async () => {
    let { brandId, cateId, keyword, isFavorite } = this.$router.params; //获取分享进来的参数share
    try {
      const result = await this.props.fetchPageData(GOODSLIST, {
        // pageSize: pageSize,
        // currentPage: currentPage + 1,
        brandId: brandId ? brandId : null,
        cateId: cateId ? cateId : null,
        keyword: keyword,
        pageSize: 14,
        currentPage: 1,
        isFavorite: isFavorite ? !!isFavorite : null
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * 上拉加载更多
   */
  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize } = this.props.goodsList;
    let { brandId, cateId, keyword, isFavorite } = this.$router.params; //获取分享进来的参数share
    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData(GOODSLIST, {
          brandId: brandId ? brandId : null,
          cateId: cateId ? cateId : null,
          keyword: keyword,
          pageSize: pageSize,
          currentPage: currentPage + 1,
          isFavorite: isFavorite ? !!isFavorite : null
        });
        console.log("请求成功", result);
      } else {
        console.log("没有更多了");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // onScrollToLower = () => {
  //   const { currentPage, hasNext, pageSize } = this.props.goodsList;
  //   // console.log('滑到底部');
  //   this.props.fetchMorePageData(GOODSLIST, {
  //     pageSize: pageSize,
  //     currentPage: currentPage + 1,
  //     // brandId: item.brandId ? item.brandId : null,
  //     // cateId: item.cateId ? item.cateId : null,
  //     keyword: "奶粉"
  //   });
  // };

  // goGoodsDetailHandler = () => {
  //   Taro.navigateTo({
  //     url: `/pages/goodsDetail/index?id=1271`
  //   });
  // };

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { tagList } = this.props.home;
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
        onScrollToLower={this.fetchMorePageData}
      >
        <ZXJGoodsList list={items} tagList={tagList} />
      </ScrollView>
    );
  }
}

export default GoodsList as ComponentClass<PageOwnProps, PageState>;
