/*
 * @Author: Hank
 * @Date: 2019-02-19 14:33:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-20 11:28:54
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
  fetchPaymentMethod
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
  ({ cart }) => ({
    cart
  }),
  {
    add: add,
    login: login,
    fetchPageData: fetchPageData,
    modifyCart: modifyCart,
    removeFromCart: removeFromCart,
    fetchCartSummary: fetchCartSummary,
    setCartLocation: setCartLocation,
    fetchPaymentMethod: fetchPaymentMethod
  }
)
class CartSummary extends Component {
  config: Config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    warehouses: [{ data: {} }],
    value: "Balance"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (getGlobalData("token")) {
      this.fetchCartSummary();
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
      value
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

  checkOutHandler = () => {
    console.log("合计");
  };

  addAddressHandler = () => {
    // Taro.navigateTo({ url: "/pages/address/index" });
    Taro.navigateTo({ url: "/pages/addressUpdate/index" });
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { warehouses, totalPrice, delivery } = this.props.cart;
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
          <View className="address" onClick={this.addAddressHandler}>
            请添加地址
          </View>
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
            value={this.state.value}
            onClick={this.handleChange.bind(this)}
          />
          <View className="total-price">
            <View>商品金额</View>
            <View>{totalPrice}</View>
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
