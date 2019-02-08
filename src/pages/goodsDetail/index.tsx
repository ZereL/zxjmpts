/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-08 15:24:11
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { login, fetchPageData, clearPageData } from "../../actions";
import { GOODSDETAIL } from "../../constants";
import Carousel from "../../components/Carousel";
import { AtTabBar, AtDivider } from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix } from "../../config";

type PageStateProps = {
  goodsDetail: {
    num: number;
    images: Array<string>;
    name: string;
    price: any;
    contentImages: Array<string>;
  };
};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  clearPageData: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsDetail {
  props: IProps;
}

@connect(
  ({ goodsDetail }) => ({
    goodsDetail
  }),
  {
    fetchPageData: fetchPageData,
    clearPageData: clearPageData,
    login: login
  }
)
class GoodsDetail extends Component {
  static defaultProps = {
    goodsDetail: {
      images: [],
      name: "",
      price: "",
      contentImages: []
    }
  };

  state = {
    activeTab: 0
  };

  config: Config = {
    navigationBarTitleText: "商品详情"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.props.clearPageData(GOODSDETAIL);
  }

  componentDidShow() {
    this.fetchPageData();
  }

  componentDidHide() {
  }

  /********************* 事件handler **********************/
  fetchPageData = async () => {
    const { id } = this.$router.params;
    console.log("id", id);
    console.log("this.$router", this.$router);

    try {
      const result = await this.props.fetchPageData(GOODSDETAIL, { id: id });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  tabBarClickHandler = value => {
    this.setState({
      activeTab: value
    });
  };

  goCart = () => {
    // 适配H5
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.navigateTo({
        url: "/pages/cart/index"
      });
    } else {
      Taro.switchTab({
        url: "/pages/cart/index"
      });
    }
  };

  addToCart = () => {
    console.log("加入购物车");
  };

  goCustomerService = () => {
    console.log("进入客服");
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { images, name, price, contentImages } = this.props.goodsDetail;
    return (
      <View className="detail-page">
        {/* 顶部tabBar */}
        {/* TODO： 如果这个TabBar想有用的话， 那么就得把这页换成scrollview中。 */}
        <AtTabBar
          tabList={[{ title: "商品" }, { title: "相关" }, { title: "详情" }]}
          onClick={this.tabBarClickHandler}
          current={this.state.activeTab}
        />
        {/* 轮播图 */}
        <View className="image-box-wrap">
          <View className="image-box clearfix">
            <Carousel images={images} />
          </View>
        </View>
        {/* 商品详情 */}
        <View className="container">
          {/* 商品名称价格*/}
          <View className="info-business-card">
            <View className="model"> ¥{price.price}</View>
          </View>
          <View className="product_name">{name}</View>
          {/* 商品图片详情*/}
          <View className="goods-info">
            {/* <Image src={`${IMAGE_URL}${contentImages[0]}${cdnMediumSuffix}`} /> */}
            {contentImages.map((item, index) => {
              return (
                <Image
                  src={`${IMAGE_URL}${item}${cdnMediumSuffix}`}
                  key={index}
                />
              );
            })}
          </View>
        </View>
        {/* 底部操作栏 */}
        <View className="detail-bottom-btns">
          <View className="nav" onClick={this.goCustomerService}>
            <Image
              className="nav-img"
              src={require("../../assets/icon/resource24.png")}
            />
            客服
          </View>
          <View className="nav" onClick={this.goCart}>
            <Image
              className="nav-img"
              src={require("../../assets/icon/resource14.png")}
            />
            聚宝盆
            {/* {items.length > 0 && (
              <View className="zan-badge__count">{items.length}</View>
            )} */}
          </View>
          <View
            // className={currentChooseId == "" ? "join join-disabled" : "join"}
            className="join"
            onClick={this.addToCart}
          >
            加入聚宝盆
          </View>
        </View>
      </View>
    );
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>;
