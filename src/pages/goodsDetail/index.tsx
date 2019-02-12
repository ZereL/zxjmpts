/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-12 14:45:29
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  login,
  fetchPageData,
  clearPageData,
  requestUpdateCart
} from "../../actions";
import { GOODSDETAIL, CART } from "../../constants";
import Carousel from "../../components/Carousel";
import {
  AtTabBar,
  AtDivider,
  AtButton,
  AtActionSheet,
  AtActionSheetItem
} from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix, cdnSmallSuffix } from "../../config";

type PageStateProps = {
  goodsDetail: {
    num: number;
    images: Array<string>;
    name: string;
    price: any;
    contentImages: Array<string>;
    skus: Array<any>;
    property: Array<any>;
  };
};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  clearPageData: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  requestUpdateCart: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {

};

type PageState = {
  activeTab: number;
  isChooseModelModalShow: boolean;
};

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
    requestUpdateCart: requestUpdateCart
  }
)
class GoodsDetail extends Component {
  // static defaultProps = {
  //   goodsDetail: {
  //     images: [],
  //     name: "",
  //     price: "",
  //     contentImages: []
  //   }
  // };

  state = {
    activeTab: 0,
    isChooseModelModalShow: false
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
    // const { id } = this.$router.params;
    // console.log("id", id);
    // console.log("this.$router", this.$router);

    const id = 717;

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

  /**
   * 普通模式下加入购物车
   */
  addToCart = () => {
    const { id } = this.$router.params;
    console.log("加入购物车id", id);
    const { skus } = this.props.goodsDetail;
    this.props.requestUpdateCart(GOODSDETAIL, {
      skuId: skus[0][0].id,
      qty: 1
    });
  };

  /**
   * 选择规格
   */
  chooseModel = () => {
    this.setState({ isChooseModelModalShow: true });
  };

  goCustomerService = () => {
    console.log("进入客服");
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const {
      images,
      name,
      price,
      contentImages,
      property
    } = this.props.goodsDetail;
    let share = this.$router.params.share; //获取分享进来的参数share
    return (
      <View className="detail-page">
        {/* 顶部tabBar */}
        {/* TODO： 如果这个TabBar想有用的话， 那么就得把这页换成scrollview中。 */}
        <Button open-type="share">分享本页</Button>
        <Button open-type="share">显示modal</Button>
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
            // onClick={property.length > 0 ? this.chooseModel : this.addToCart}
            onClick={ this.chooseModel}
          >
            {property.length > 0 ? "选择规格" : "加入聚宝盆"}
          </View>
        </View>
        {/* <AtActionSheet isOpened={this.state.isChooseModelModalShow}>
          {property.map((item, index) => {
            
          })}
        </AtActionSheet> */}
      </View>
    );
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>;
