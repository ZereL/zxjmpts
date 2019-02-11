/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-11 13:00:47
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { login, fetchPageData, clearPageData } from "../../actions";
import { GOODSDETAIL } from "../../constants";
import Carousel from "../../components/Carousel";
import { AtTabBar, AtDivider, AtButton } from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix, cdnSmallSuffix } from "../../config";

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
    let params = this.$router.params;
    console.log("params", params);
    this.fetchPageData();
  }

  componentDidHide() {}

  //这个分享的函数必须写在入口中，写在子组件中不生效
  onShareAppMessage() {
    const { images } = this.props.goodsDetail;
    const goodsId = 128;
    const code = `FSI005`;
    const hash = `570AD6F305EC6EA60DCA5DCFAE67AE09`;
    return {
      title: "海淘更便宜，分享有收益❤️全球臻选好物等您来👇。",
      path: `/pages/goodsDetail/index?id=${goodsId}&code=${code}&hash=${hash}&share=true`,
      imageUrl: `/src/assets/icon/resource63.png`, // TODO：自定义分享图片目前好像不行
      success: function(res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
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
    let share = this.$router.params.share; //获取分享进来的参数share
    return (
      <View className="detail-page">
        {/* 顶部tabBar */}
        {/* TODO： 如果这个TabBar想有用的话， 那么就得把这页换成scrollview中。 */}
        <Button open-type="share">分享本页</Button>
        {share ? <Text className="fixIndex">通过分享进入页面</Text> : null}
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
