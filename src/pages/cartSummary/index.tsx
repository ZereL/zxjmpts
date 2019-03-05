/*
 * @Author: Hank
 * @Date: 2019-02-19 14:33:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 14:15:37
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, ScrollView, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  add,
  login,
  fetchPageData,
  modifyCart,
  removeFromCart,
  fetchCartSummary,
  setCartLocation,
  fetchPaymentMethod,
  fetchCartAddress,
  requestCreateOrder,
  requestPayOrder
} from "../../actions";
import { CART } from "../../constants";
import { getGlobalData } from "../../utils/common";
import CartItem from "../../components/CartItem";
import { IMAGE_URL } from "../../config/index";
import { AtRadio } from "taro-ui";
type PageStateProps = {
  cart: {
    warehouses: any;
    totalPrice: number;
  };
  address: {};
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
  modifyCart: (namespace: string, payload?: any) => any;
  removeFromCart: (namespace: string, payload?: any) => any;
  fetchCartSummary: (namespace: string, payload?: any) => any;
  setCartLocation: (namespace: string, payload?: any) => any;
  fetchPaymentMethod: (namespace: string, payload?: any) => any;
  fetchCartAddress: (namespace: string, payload?: any) => any;
  requestCreateOrder: (namespace: string, payload?: any) => any;
  requestPayOrder: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {
  warehouses: any;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface CartSummary {
  props: IProps;
}

@connect(
  ({ cart, address }) => ({
    cart,
    address
  }),
  {
    add: add,
    login: login,
    fetchPageData: fetchPageData,
    modifyCart: modifyCart,
    removeFromCart: removeFromCart,
    fetchCartSummary: fetchCartSummary,
    setCartLocation: setCartLocation,
    fetchPaymentMethod: fetchPaymentMethod,
    fetchCartAddress: fetchCartAddress,
    requestCreateOrder: requestCreateOrder,
    requestPayOrder: requestPayOrder
  }
)
class CartSummary extends Component {
  config: Config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    warehouses: [{ data: {} }],
    paymentMethod: "Balance"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  async componentDidShow() {
    if (getGlobalData("token")) {
      Taro.showLoading({ title: "加载中...", mask: true });
      await this.fetchCartSummary();
      Taro.hideLoading();
    } else {
      Taro.showToast({ title: "尚未登录", icon: "none", duration: 2000 });
    }
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  fetchCartSummary = async () => {
    // const { dispatch, cartReceiver } = this.props;
    // dispatch({
    //   type: `cartsummary/${SET_CART_LOCATION}`,
    //   payload: {
    //     // resultType: RESULT_TYPE_SUMMARY
    //     locationCode: cartReceiver == null ? "CN11010200" : cartReceiver.enCode
    //   },
    //   cancelToken: this.source.token
    // })
    //   .then(data => {
    //     Toast.hide();
    //     if (data.status != CART_VALID_STATUS) {
    //       Toast.fail(data.message);
    //     }

    //     dispatch({
    //       type: `cart/${FETCH_PAYMENTMETHODS}`,
    //       payload: {
    //         Price: data.totalPrice
    //       }
    //     }).catch(error => {
    //       Toast.offline(error.message);
    //     });

    //     // 构造商品数据源
    //     const { warehouses = [] } = data;
    //     const { items = [] } = data;
    //     // 商品按照仓库号加入对应仓库
    //     warehouses.forEach(warehouse => {
    //       warehouse.data = items.filter(
    //         item => item.warehouseId == warehouse.id
    //       );
    //     });
    //     this.setState({ warehouses });
    //   })
    //   .catch(error => {
    //     Toast.offline(error.message);
    //   });

    const { status, warehouses, items } = await this.props.setCartLocation(
      "cart"
    ); // 可能需要 写 "CN11010200"
    const result = await this.props.fetchCartAddress("address");
    console.log("defaultAddress", result);
    status == "Valid" && this.props.fetchPaymentMethod("cart");
    // 商品按照仓库号加入对应仓库
    warehouses.forEach(warehouse => {
      warehouse.data = items.filter(item => item.warehouseId == warehouse.id);
    });
    console.log("warehouses123", warehouses);
    this.setState({ warehouses });
    // console.log("status", status);
  };

  handleChange(value) {
    this.setState({
      paymentMethod: value
    });
  }

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchCartSummary("cart");
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  deleteGoodsHandler = () => {};
  // changeGoodsQtyHandler = (goodsItem) => {
  //   console.log("数量改变", goodsItem);
  // };

  // changeGoodsQtyHandler(goodsItem) {
  //   // console.log("数量改变", goodsItem);
  //   // const newQty = this.refs.CartItem.getCount;
  //   // console.log("newQty", newQty);
  //   this.props.modifyCart(CART, {
  //     payload: {
  //       warehouseId: goodsItem.warehouseId,
  //       id: goodsItem.skuId,
  //       qty: goodsItem.tmpQty + 1,
  //       selected: true
  //     }
  //   });
  // }

  checkOutHandler = async () => {
    const { totalPrice } = this.props.cart;
    const { defaultAddress } = this.props.address;
    console.log("defaultAddress", defaultAddress);

    if (!defaultAddress) {
      Taro.showToast({
        title: "请先添加默认收货地址",
        icon: "none",
        duration: 2000
      });
      return null;
    }

    const { paymentMethod } = this.state;
    const orderId = await this.props.requestCreateOrder("order", {
      totalPrice: totalPrice,
      remark: "",
      country: "CN",
      province: defaultAddress.province,
      city: defaultAddress.city,
      area: defaultAddress.area,
      detailAddress: defaultAddress.detailAddress,
      name: defaultAddress.name,
      phoneNum: defaultAddress.phoneNum,
      idNum: defaultAddress.idNum,
      enCode: defaultAddress.enCode,
      addressId: defaultAddress.id,
      channel: 1 // 现在先用1
      // sender: {
      //   id: 0,
      //   name: "string",
      //   phoneNum: "string"
      // }
    });

    try {
      if (paymentMethod == "Balance") {
        const payResult = await this.props.requestPayOrder("order", {
          // memberId: 0,
          orderId: orderId,
          paymentConfigId: "1"
          // wechatCode: "string",
          // joinedPay: true
        });
        Taro.showToast({ title: "支付成功", icon: "none", duration: 2000 });
      } else if (paymentMethod == "WechatSupay") {
        const wechatCode = await Taro.login();
        const payResult = await this.props.requestPayOrder("order", {
          // memberId: 0,
          orderId: orderId,
          paymentConfigId: "3",
          wechatCode: wechatCode.code,
          joinedPay: false
        });
        console.log("payResult", payResult);
        const { payUrl } = payResult;
        Taro.requestPayment({
          timeStamp: payUrl.timeStamp,
          nonceStr: payUrl.nonceStr,
          package: payUrl.package,
          signType: payUrl.signType,
          paySign: payUrl.paySign
        })
          .then(res => {
            console.log("res", res);
            Taro.showToast({ title: "支付成功", icon: "none", duration: 2000 });
          })
          .catch(res => {
            console.log("res", res);
            Taro.showToast({ title: "支付失败", icon: "none", duration: 2000 });
          });
      }
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
      Taro.showToast({ title: error.message, icon: "none", duration: 2000 });
    }

    // TotalPrice: data.totalPrice, // TODO: 暂时使用购物车总价，实际需要使用支付方式接口返回的总价
    // Remark: "", // 备注字段
    // Country: "CN",
    // Province: cartReceiver.province,
    // City: cartReceiver.city,
    // Area: cartReceiver.area,
    // DetailAddress: cartReceiver.detailAddress,
    // Name: cartReceiver.name,
    // PhoneNum: cartReceiver.phoneNum,
    // IdNum: cartReceiver.idNum,
    // EnCode: cartReceiver.enCode,
    // AddressId: cartReceiver.id,
    // channel: Platform.OS === "ios" ? 1 : 2 // 后端Android写成了Adnro
  };

  addAddressHandler = () => {
    // Taro.navigateTo({ url: "/pages/address/index" });
    Taro.navigateTo({ url: "/pages/addressUpdate/index" });
  };

  addressListHandler = () => {
    Taro.navigateTo({ url: "/pages/address/index" });
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const {
      warehouses,
      totalPrice,
      delivery,
      totalPriceWithoutDelivery
    } = this.props.cart;
    const { defaultAddress } = this.props.address;
    console.log("defaultAddress", defaultAddress);
    console.log("warehouses", warehouses);

    const goodsList =
      this.state.warehouses &&
      Array.prototype.concat(
        ...this.state.warehouses.map(warehouse => warehouse.data)
      );

    console.log("goodsList", goodsList);

    return (
      <View className="cart-page">
        <ScrollView
          style={`height: ${getGlobalData("systemInfo").windowHeight - 100}px`}
          scrollY
          scrollWithAnimation
        >
          {defaultAddress ? (
            <View className="address" onClick={this.addressListHandler}>
              <View className="address-row">
                {defaultAddress.name}, {defaultAddress.phoneNum}
              </View>
              <View className="address-row">
                {defaultAddress.area} {defaultAddress.city}{" "}
                {defaultAddress.detailAddress}
              </View>
            </View>
          ) : (
            <View className="address" onClick={this.addAddressHandler}>
              请添加地址
            </View>
          )}
          <View className="goods-row">
            {goodsList.map((item, index) => {
              return (
                <Image
                  key={index}
                  mode="aspectFit"
                  style="width: 100px;height: 100px;background: #fff;" // TODO: 这里为什么使用className就改变不了样式？？？？？？？
                  className="img"
                  src={
                    item.image
                      ? `${IMAGE_URL}${
                          item.image
                        }?width=300&constrain=true&bgcolor=white`
                      : ""
                  }
                />
              );
            })}
            <View className="totolNum">共{goodsList.length}件</View>
          </View>
          <AtRadio
            options={[
              { label: "臻金", value: "Balance" },
              { label: "支付宝", value: "AlipaySupay", disabled: true },
              { label: "微信", value: "WechatSupay" }
            ]}
            value={this.state.paymentMethod}
            onClick={this.handleChange.bind(this)}
          />
          <View className="total-price">
            <View>商品金额</View>
            <View>{totalPriceWithoutDelivery}</View>
          </View>
          <View className="courier-price">
            <View>运费</View>
            {/* TODO： 这里需要修改 */}
            <View>{delivery || 0}</View>
          </View>
        </ScrollView>
        <View className="bottom-count" style={"bottom:0;"}>
          <View className="fj">
            <View>
              实付款：
              <Text className={!warehouses.length ? "disabled price" : "price"}>
                {totalPrice}
              </Text>
            </View>
            <Button
              className="cart-btn"
              onClick={this.checkOutHandler}
              disabled={!warehouses.length}
            >
              确定支付
            </Button>
            {/* <View className="info">
                  不含运费
                </View> */}
          </View>
        </View>
      </View>
    );
  }
}

export default CartSummary as ComponentClass<PageOwnProps, PageState>;
