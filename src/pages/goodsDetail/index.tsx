/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-27 13:33:42
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, clearPageData, requestUpdateCart } from "../../actions";
import { GOODSDETAIL } from "../../constants";
import Carousel from "../../components/Carousel";
import { AtTabBar, AtButton, AtFloatLayout, AtTag } from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix, cdnSmallSuffix } from "../../config";
import { getGlobalData } from "../../utils/common";

type PageStateProps = {
  goodsDetail: {
    num: number;
    images: Array<string>;
    name: string;
    price: any;
    contentImages: Array<string>;
    // property: Array<Object>;
    // skus: Array<Array<Object>>;
    property: any;
    skus: any;
    image: any;
  };
};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  clearPageData: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  requestUpdateCart: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {
  activeTab: number;
  isChooseModelModalShow: boolean;
  // property: Array<Object>;
  // skus: Array<Array<Object>>;
  property: Array<{
    key: string;
    values: Array<string>;
    selectedIndex: number;
  }>;
  skus: any;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsDetail {
  props: IProps;
}
const windowWidth = getGlobalData("systemInfo").windowWidth;
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
// TODO: 现在和APP一样，不管库存是多少，status是怎样，都可以下单。可能以后要改
class GoodsDetail extends Component {
  state = {
    activeTab: 0,
    isChooseModelModalShow: false,
    hasProperty: false,
    property: [{ key: "", values: [], selectedIndex: -1 }], // TS会自动匹配class里面的state的默认数据解构
    skus: [],
    loading: true,
    isLiked: false,
    skuPrice: "",
    firstRowIndex: 0,
    secondRowIndex: -1
  };

  config: Config = {
    navigationBarTitleText: "商品详情"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);

    // TODO： 这个有可能需要修改！！！ 每次都setState肯定有问题
    // 组件每次接收数据都判断一下是否含有property，有property就显示选择规格，没有就显示加入购物车
    let { property, skus } = nextProps.goodsDetail;
    // console.log("property", property);
    // 容错防止property传过来null
    if (!property) {
      property = [];
    }
    // 判断property数组是否为空
    if (property.length > 0) {
      this.setState({ hasProperty: true, skus, property });
    }
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

  // //这个分享的函数必须写在入口中，写在子组件中不生效
  // onShareAppMessage() {
  //   const { images } = this.props.goodsDetail;
  //   const goodsId = 128;
  //   const code = `FSI005`;
  //   const hash = `570AD6F305EC6EA60DCA5DCFAE67AE09`;
  //   return {
  //     title: "海淘更便宜，分享有收益❤️全球臻选好物等您来👇。",
  //     path: `/pages/goodsDetail/index?id=${goodsId}&code=${code}&hash=${hash}&share=true`,
  //     imageUrl: `/src/assets/icon/resource63.png`, // TODO：自定义分享图片目前好像不行
  //     success: function(res) {
  //       console.log(res);
  //       console.log("转发成功:" + JSON.stringify(res));
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //       console.log("转发失败:" + JSON.stringify(res));
  //     }
  //   };
  // }

  /********************* 事件handler **********************/
  /**
   * 获取页面数据
   */
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

  /**
   * 顶部tabBar的点击事件handler
   */
  tabBarClickHandler = value => {
    this.setState({
      activeTab: value
    });
  };

  /**
   * 跳转到购物车
   */
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
  addToCart = async () => {
    Taro.showLoading({ title: "加入购物车...", mask: true });
    const { id } = this.$router.params;
    console.log("加入购物车id", id);
    const { skus } = this.props.goodsDetail;
    const addCartResult = await this.props.requestUpdateCart(GOODSDETAIL, {
      skuId: skus[0][0].id,
      qty: 1
    });

    if (addCartResult.success) {
      Taro.hideLoading();
      Taro.showToast({
        title: "加入购物车成功",
        icon: "success",
        duration: 2000
      });
    } else {
      Taro.hideLoading();
      Taro.showToast({ title: "加入购物车失败", icon: "none", duration: 2000 });
    }
  };

  /**
   * 选择规格
   */
  chooseModel = () => {
    this.setState({ isChooseModelModalShow: true });
  };

  /**
   * 客服按钮点击事件handler
   */
  goCustomerService = () => {
    console.log("进入客服");
  };

  /**
   * 点击隐藏modal事件handler
   */
  modalCloseHandler = () => {
    this.setState({ isChooseModelModalShow: false });
  };

  /**
   * 点击tag事件handler
   */
  tagClickHandler(
    itemProperty,
    indexValue,
    index,
    property,
    skus,
    { name, active }
  ) {
    const { firstRowIndex, secondRowIndex } = this.state;
    console.log(name, itemProperty, indexValue, index, property, skus);
    console.log("indexValue", indexValue);
    let selectedSku;
    console.log("name", name, "active", active);
    console.log("index", index, "indexValue", indexValue);
    console.log("skus", skus);
    // this.setState({ firstRowIndex: indexValue, secondRowIndex: index });
    index == 0 && this.setState({ firstRowIndex: indexValue });
    index == 1 && this.setState({ secondRowIndex: indexValue });

    // 注释掉这里看看行不行
    if (index == 0 && property.length > 1) {
      // 切换第一列时重置第二列
      skus[indexValue][secondRowIndex] == null &&
        this.setState({ secondRowIndex: -1 });
    }
    if (!active) {
      // 如果第一行被选中，而且有property的第二维有数据， 29/10考虑只有一维数组有数据情况
      if (index == 0 && property[1]) {
        // 如果选的是第一行，而且第二行已经选中，点击之后查询对应SKUPrice
        if (index == 0 && secondRowIndex !== -1) {
          console.log("firstRowIndex", firstRowIndex);
          console.log("secondRowIndex", secondRowIndex);
          selectedSku = skus[firstRowIndex][secondRowIndex];
          console.log("selectedSku", selectedSku);
          if (selectedSku.useSkuPrice) {
            // 如果需要使用SKUPrice，设置skuPrice
            this.setState({
              skuPrice: selectedSku.price
            });
          } else {
            // 如果不需要使用，清空skuPrice
            this.setState({
              skuPrice: ""
            });
          }
        } else {
          // 如果第二行没有选中， 什么都不做
        }
      } else if (
        // 如果选的是第二行，且第一行也选中，点击之后查询对应SKUPrice
        index == 1 &&
        firstRowIndex !== -1
      ) {
        console.log(
          "firstRowIndex",
          firstRowIndex,
          "secondRowIndex",
          secondRowIndex
        );
        // selectedSku = skus[firstRowIndex][secondRowIndex]; // secondRowIndex不行，可能因为setState是异步的
        selectedSku = skus[firstRowIndex][indexValue];
        console.log("selectedSku", selectedSku);
        if (selectedSku.useSkuPrice) {
          // 如果需要使用SKUPrice，设置skuPrice
          this.setState({
            skuPrice: selectedSku.price
          });
        } else {
          // 如果不需要使用，清空skuPrice
          this.setState({
            skuPrice: ""
          });
        }
      } else {
        // 如果有一行没有选，清空skuPrice
        this.setState({
          skuPrice: ""
        });
      }
    } else {
      // 取消选中时重置当前列
      index == 0 && this.setState({ firstRowIndex: -1 });
      index == 1 && this.setState({ secondRowIndex: -1 });
    }
    this.setState({
      property: property
    });
  }

  /**
   * 在modal中点击加入购物车事件handler
   */
  modalAddToCartHandler = () => {
    const { skus } = this.props.goodsDetail;
    const { property, firstRowIndex, secondRowIndex } = this.state;

    this.setState({
      isChooseModelModalShow: false
    });

    if (getGlobalData("token")) {
      Taro.showToast({ title: "正在加入购物车", icon: "loading" });

      // modal下，如果用户没有选择规格直接下单，防止崩溃
      if (firstRowIndex == -1 || secondRowIndex == -1) {
        Taro.showToast({ title: "请选择规格", icon: "none", duration: 2000 });
        return null;
      }

      // property 有1个元素或者2个元素对应sku不同
      const selectedSku =
        property.length == 1
          ? skus[0][firstRowIndex]
          : skus[firstRowIndex][secondRowIndex];

      console.log("selectedSku", selectedSku);

      this.props.requestUpdateCart(GOODSDETAIL, {
        skuId: selectedSku.id,
        qty: 1
      });
    } else {
      console.log("请登录");
    }
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const {
      skus,
      property,
      skuPrice,
      firstRowIndex,
      secondRowIndex
    } = this.state;
    const {
      images,
      name,
      price,
      contentImages,
      image
      // property,
      // skus
    } = this.props.goodsDetail;
    let share = this.$router.params.share; //获取分享进来的参数share

    console.log("images", images);

    // SKU的图片
    let skuImage = "";
    let foundImage = false;
    property.forEach((itemProperty, index) => {
      if (!foundImage && firstRowIndex != -1) {
        const value = itemProperty.values[firstRowIndex];
        const filteredImages = images.filter(image => image.property == value);
        if (filteredImages.length > 0) {
          skuImage = filteredImages[0];
          foundImage = true;
        }
      }
    });

    skuImage == "" && (skuImage = { image: image });
    skuImage == "" && (skuImage = images[0]);

    console.log("property", property);
    console.log("property.length", property.length);
    return (
      <View className="detail-page">
        {/* 顶部tabBar */}
        {/* TODO： 如果这个TabBar想有用的话， 那么就得把这页换成scrollview中。 */}
        {/* <Button open-type="share">分享本页</Button>
        <Button open-type="share">显示modal</Button> */}
        {share ? <Text className="fixIndex">通过分享进入页面</Text> : null}
        <AtTabBar
          tabList={[{ title: "商品" }, { title: "相关" }, { title: "详情" }]}
          onClick={this.tabBarClickHandler}
          current={this.state.activeTab}
        />
        {/* 轮播图 */}
        <View className="image-box-wrap">
          <View
            className="clearfix"
            style={`width: ${windowWidth}px;height: ${windowWidth}px`}
          >
            <Carousel
              images={images}
              // containerStyle={"height: 550px;"}
              // imageStyle={"height: 600px;"}
              containerStyle={`width: ${windowWidth}px;height: ${windowWidth}px`}
              imageStyle={`width: ${windowWidth}px;height: ${windowWidth}px`}
            />
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
              const windowWidth = getGlobalData("systemInfo").windowWidth;
              return (
                <Image
                  style={`width: ${windowWidth}px; display:block`}
                  src={`${IMAGE_URL}${item}${cdnMediumSuffix}`}
                  key={index}
                  mode={"widthFix"}
                />
              );
            })}
          </View>
        </View>
        {/* 底部操作栏 */}
        <View className="detail-bottom-btns">
          <AtButton
            className="nav"
            onClick={this.goCustomerService}
            open-type="contact"
          >
            <Image
              className="nav-img"
              src={require("../../assets/icon/resource24.png")}
            />
            {/* 客服 */}
          </AtButton>
          <View className="nav" onClick={this.goCart}>
            <Image
              className="nav-img"
              src={require("../../assets/icon/resource14.png")}
            />
            {/* 聚宝盆 */}
            {/* {items.length > 0 && (
              <View className="zan-badge__count">{items.length}</View>
            )} */}
          </View>
          {this.state.hasProperty ? (
            <View
              // className={currentChooseId == "" ? "join join-disabled" : "join"}
              className="join"
              // onClick={property.length > 0 ? this.chooseModel : this.addToCart}
              onClick={this.chooseModel}
            >
              选择规格
            </View>
          ) : (
            <View
              // className={currentChooseId == "" ? "join join-disabled" : "join"}
              className="join"
              // onClick={property.length > 0 ? this.chooseModel : this.addToCart}
              onClick={this.addToCart}
            >
              加入聚宝盆
            </View>
          )}
        </View>

        <AtFloatLayout
          isOpened={this.state.isChooseModelModalShow}
          // title="这是个标题"
          className="float-layout"
          onClose={this.modalCloseHandler}
        >
          <View
            // className="float-layout-topinfo"
            style={`width: ${
              getGlobalData("systemInfo").screenWidth
            }px; height:150px;`}
          >
            <Image
              mode="aspectFit"
              className="image-box"
              src={`${IMAGE_URL}${skuImage.image}`}
            />
            <View className="price-box">
              ￥{skuPrice ? skuPrice : price.price}
            </View>
          </View>
          {property.map((itemProperty, index) => {
            const { key, values } = itemProperty;

            return (
              // 遍历输出tags的分类名称，如 颜色、尺码
              <View
                key={`${itemProperty}${index}`}
                style={`width: ${getGlobalData("systemInfo").screenWidth}px;`}
              >
                {key}
                <View>
                  {values.map((itemPropertyValue, indexValue) => {
                    return (
                      <AtTag
                        name={`${indexValue}`}
                        key={`${itemPropertyValue}${indexValue}`}
                        active={
                          index == 0
                            ? indexValue == firstRowIndex
                            : indexValue == secondRowIndex
                        }
                        // 设置是否disable
                        // 如果第一行没有选中任何节点，则第二行都是有效状态
                        // 如果是第一行，则都是有效状态
                        // 如果是第二行，则对应的sku不是空才有效
                        disabled={
                          firstRowIndex == -1 || index == 0
                            ? false
                            : skus[firstRowIndex][indexValue] == null
                        }
                        onClick={this.tagClickHandler.bind(
                          this,
                          itemProperty,
                          indexValue,
                          index,
                          property,
                          skus
                        )}
                      >
                        {itemPropertyValue}
                      </AtTag>
                    );
                  })}
                </View>
              </View>
            );
          })}
          <AtButton onClick={this.modalAddToCartHandler}>加入购物车</AtButton>
        </AtFloatLayout>
      </View>
    );
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>;
