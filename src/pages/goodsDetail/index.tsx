/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-14 11:15:51
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
  AtActionSheetItem,
  AtFloatLayout,
  AtTag
} from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix, cdnSmallSuffix } from "../../config";

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
    isChooseModelModalShow: false,
    hasProperty: false,
    property: [{ key: "", values: [], selectedIndex: -1 }], // TS会自动匹配class里面的state的默认数据解构
    skus: [],
    loading: true,
    isLiked: false,
    skuPrice: ""
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

  modalCloseHandler = () => {
    this.setState({ isChooseModelModalShow: false });
  };

  // tagClickHandler(num1, num2) {
  //   console.log("num1", num1);
  //   console.log("num2", num2);
  // }

  tagClickHandler(
    itemProperty,
    indexValue,
    index,
    property,
    skus,
    { name, active }
  ) {
    console.log(name, itemProperty, indexValue, index, property, skus);
    console.log("indexValue", indexValue);
    let selectedSku;
    if (name && active) {
      itemProperty.selectedIndex = indexValue; // 点击时给itemProperty下面的selectedIndex赋值保存用户的选项（之前是分别存在两个state里）
      if (index == 0 && property.length > 1) {
        // 切换第一列时重置第二列
        skus[indexValue][property[1].selectedIndex] == null &&
          (property[1].selectedIndex = -1);
      }
      // 如果第一行被选中，而且有property的第二维有数据， 29/10考虑只有一维数组有数据情况
      if (index == 0 && property[1]) {
        // 如果选的是第一行，而且第二行已经选中，点击之后查询对应SKUPrice
        if (index == 0 && property[1].selectedIndex !== -1) {
          selectedSku =
            skus[property[0].selectedIndex][property[1].selectedIndex];
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

        // index == 0 && property[1].selectedIndex !== -1
        // selectedSku =
        //   skus[property[0].selectedIndex][
        //     property[1].selectedIndex
        //   ];
        // console.log(selectedSku);
        // if (selectedSku.useSkuPrice) {
        //   // 如果需要使用SKUPrice，设置skuPrice
        //   this.setState({
        //     skuPrice: selectedSku.price
        //   });
        // } else {
        //   // 如果不需要使用，清空skuPrice
        //   this.setState({
        //     skuPrice: ""
        //   });
        // }
      } else if (
        // 如果选的是第二行，且第一行也选中，点击之后查询对应SKUPrice
        index == 1 &&
        property[0].selectedIndex !== -1
      ) {
        selectedSku =
          skus[property[0].selectedIndex][property[1].selectedIndex];
        console.log(selectedSku);
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
      itemProperty.selectedIndex = -1;
    }
    this.setState({
      property: property
    });
    this.forceUpdate();
  }

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { skus, property, skuPrice } = this.state;
    const {
      images,
      name,
      price,
      contentImages
      // property,
      // skus
    } = this.props.goodsDetail;
    let share = this.$router.params.share; //获取分享进来的参数share

    console.log("property", property);
    console.log("property.length", property.length);
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
            onClick={this.chooseModel}
          >
            {property.length > 0 ? "选择规格" : "加入聚宝盆"}
          </View>
        </View>

        <AtFloatLayout
          isOpened={this.state.isChooseModelModalShow}
          // title="这是个标题"
          onClose={this.modalCloseHandler}
        >
          {/* <View>商品图片，名称</View>
          <View>颜色</View>
          <View>
            <AtTag>红</AtTag>
            <AtTag>黄</AtTag>
            <AtTag>蓝</AtTag>
          </View>
          <View>尺码</View>
          <View>
            <AtTag>36</AtTag>
            <AtTag>37</AtTag>
            <AtTag>38</AtTag>
            <AtTag>39</AtTag>
            <AtTag>40</AtTag>
          </View>
          <AtButton>加入购物车</AtButton> */}
          {property.map((itemProperty, index) => {
            const { key, values } = itemProperty;

            // // 在itemKey下增加一个selectIndex对象来判断用户选择的选项
            // if (index === 0) {
            //   // 第一个属性默认选中第一个值
            //   itemProperty.selectedIndex == null &&
            //     (itemProperty.selectedIndex = 0);
            // } else {
            //   // 非第一个属性默认不选中任何值
            //   itemProperty.selectedIndex == null &&
            //     (itemProperty.selectedIndex = -1);
            // }

            return (
              // 遍历输出tags的分类名称，如 颜色、尺码
              <View key={`${itemProperty}${index}`}>
                {key}
                <View>
                  {values.map((itemPropertyValue, indexValue) => {
                    console.log(
                      "itemProperty.selectedIndex",
                      itemProperty.selectedIndex
                    );
                    return (
                      <AtTag
                        name={`${indexValue}`}
                        key={`${itemPropertyValue}${indexValue}`}
                        active={indexValue == itemProperty.selectedIndex}
                        // 设置是否disable
                        // 如果第一行没有选中任何节点，则第二行都是有效状态
                        // 如果是第一行，则都是有效状态
                        // 如果是第二行，则对应的sku不是空才有效
                        disabled={
                          property[0].selectedIndex == -1 || index == 0
                            ? false
                            : skus[property[0].selectedIndex][indexValue] ==
                              null
                        }
                        onClick={this.tagClickHandler.bind(
                          this,
                          itemProperty,
                          indexValue,
                          index,
                          property,
                          skus
                        )}
                        // // 设置点击事件
                        // onClick={selected => {
                        //   let selectedSku;
                        //   if (selected) {
                        //     itemProperty.selectedIndex = indexValue; // 点击时给itemProperty下面的selectedIndex赋值保存用户的选项（之前是分别存在两个state里）
                        //     if (index == 0 && property.length > 1) {
                        //       // 切换第一列时重置第二列
                        //       skus[indexValue][property[1].selectedIndex] ==
                        //         null && (property[1].selectedIndex = -1);
                        //     }
                        //     // 如果第一行被选中，而且有property的第二维有数据， 29/10考虑只有一维数组有数据情况
                        //     if (index == 0 && property[1]) {
                        //       // 如果选的是第一行，而且第二行已经选中，点击之后查询对应SKUPrice
                        //       if (
                        //         index == 0 &&
                        //         property[1].selectedIndex !== -1
                        //       ) {
                        //         selectedSku =
                        //           skus[property[0].selectedIndex][
                        //             property[1].selectedIndex
                        //           ];
                        //         console.log(selectedSku);
                        //         if (selectedSku.useSkuPrice) {
                        //           // 如果需要使用SKUPrice，设置skuPrice
                        //           this.setState({
                        //             skuPrice: selectedSku.price
                        //           });
                        //         } else {
                        //           // 如果不需要使用，清空skuPrice
                        //           this.setState({
                        //             skuPrice: ""
                        //           });
                        //         }
                        //       } else {
                        //         // 如果第二行没有选中， 什么都不做
                        //       }

                        //       // index == 0 && property[1].selectedIndex !== -1
                        //       // selectedSku =
                        //       //   skus[property[0].selectedIndex][
                        //       //     property[1].selectedIndex
                        //       //   ];
                        //       // console.log(selectedSku);
                        //       // if (selectedSku.useSkuPrice) {
                        //       //   // 如果需要使用SKUPrice，设置skuPrice
                        //       //   this.setState({
                        //       //     skuPrice: selectedSku.price
                        //       //   });
                        //       // } else {
                        //       //   // 如果不需要使用，清空skuPrice
                        //       //   this.setState({
                        //       //     skuPrice: ""
                        //       //   });
                        //       // }
                        //     } else if (
                        //       // 如果选的是第二行，且第一行也选中，点击之后查询对应SKUPrice
                        //       index == 1 &&
                        //       property[0].selectedIndex !== -1
                        //     ) {
                        //       selectedSku =
                        //         skus[property[0].selectedIndex][
                        //           property[1].selectedIndex
                        //         ];
                        //       console.log(selectedSku);
                        //       if (selectedSku.useSkuPrice) {
                        //         // 如果需要使用SKUPrice，设置skuPrice
                        //         this.setState({
                        //           skuPrice: selectedSku.price
                        //         });
                        //       } else {
                        //         // 如果不需要使用，清空skuPrice
                        //         this.setState({
                        //           skuPrice: ""
                        //         });
                        //       }
                        //     } else {
                        //       // 如果有一行没有选，清空skuPrice
                        //       this.setState({
                        //         skuPrice: ""
                        //       });
                        //     }
                        //   } else {
                        //     // 取消选中时重置当前列
                        //     itemProperty.selectedIndex = -1;
                        //   }
                        //   this.setState({
                        //     property: property
                        //   });
                        // }}
                      >
                        {itemPropertyValue}
                      </AtTag>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </AtFloatLayout>
      </View>
    );
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>;
