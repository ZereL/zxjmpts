/*
 * @Author: Hank
 * @Date: 2019-02-19 14:33:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 15:42:46
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, ScrollView, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  modifyCart,
  removeFromCart,
  fetchCartSummary,
  setCartLocation,
  fetchPaymentMethod,
  fetchCartAddress,
  requestCreateOrder,
  requestPayOrder
} from "../../actions";
import { getGlobalData } from "../../utils/common";
import { IMAGE_URL } from "../../config/index";
import { AtRadio } from "taro-ui";
type PageStateProps = {
  cart: any;
  address: any;
};

type PageDispatchProps = {
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
  /**
   * 请求页面展示数据
   */
  fetchCartSummary = async () => {
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

    this.setState({ warehouses });
  };

  paymentMethodChangeHandler(value) {
    this.setState({
      paymentMethod: value
    });
  }

  // 留着作参考
  // changeGoodsQtyHandler(goodsItem) {
  //   // console.log("数量改变", goodsItem);
  //   // const newQty = this.refs.CartItem.getCount; // 原来是，用ref在这里，取数字啊！！！已经用state实现了。
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

  /**
   * 确认支付事件
   */
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

    try {
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

      if (paymentMethod == "Balance") {
        const payResult = await this.props.requestPayOrder("order", {
          // memberId: 0,
          orderId: orderId,
          paymentConfigId: "1"
          // wechatCode: "string",
          // joinedPay: true
        });
        console.log("payResult", payResult);
        // TODO: 这里需不需要加一层payResult判断？ 目前暂时没做
        Taro.showToast({ title: "支付成功", icon: "none", duration: 2000 });
      } else if (paymentMethod == "WechatSupay") {
        const wechatCode = await Taro.login();
        const payResult = await this.props.requestPayOrder("order", {
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
      Taro.showToast({ title: error.message, icon: "none", duration: 2000 });
    }
  };

  addAddressHandler = () => {
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
            <View className="totolNum">共{goodsList.length}种</View>
          </View>
          <AtRadio
            options={[
              { label: "臻金", value: "Balance" },
              { label: "支付宝", value: "AlipaySupay", disabled: true },
              { label: "微信", value: "WechatSupay" }
            ]}
            value={this.state.paymentMethod}
            onClick={this.paymentMethodChangeHandler.bind(this)}
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
