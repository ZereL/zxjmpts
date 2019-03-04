/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-19 14:32:06
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  add,
  login,
  fetchPageData,
  modifyCart,
  removeFromCart
} from "../../actions";
import { CART } from "../../constants";
import { getGlobalData } from "../../utils/common";
import CartItem from "../../components/CartItem";
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
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Cart {
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
    removeFromCart: removeFromCart
  }
)
class Cart extends Component {
  config: Config = {
    navigationBarTitleText: "聚宝盆"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (getGlobalData("token")) {
      this.fetchPageData();
    } else {
      Taro.showToast({ title: "尚未登录", icon: "none", duration: 2000 });
    }
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("cart");
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  add = async () => {
    try {
      const result = await this.props.add(CART);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  goHome = () => {
    Taro.switchTab({
      url: "/pages/home/index"
    });
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
    // console.log("合计");
    Taro.navigateTo({ url: "/pages/cartSummary/index" });
  };

  /********************* 渲染页面的方法 *********************/
  // _estimateTotalPrice = (item, value) => {
  //   const { warehouses = [] } = this.props.cart;
  //   return warehouses
  //     .map(warehouse => {
  //       return warehouse.data.reduce((prev, cur) => {
  //         let quantity = cur.tmpQty;
  //         if (item.skuId === cur.skuId) {
  //           quantity = value;
  //         }
  //         let curPrice = cur.tmpSelected ? quantity * cur.price : 0;
  //         return prev + curPrice;
  //       }, 0);
  //     })
  //     .reduce((prev, cur) => prev + cur, 0);
  // };

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { warehouses = [{ data: [] }] } = this.props.cart; // 我去，这个得设置默认值，必须有data
    console.log("warehouses", warehouses);

    // 计算本地购物车总价
    // 这里再每次跳走天都会报错， 不知道为什么，暂时先这样吧。
    try {
      var totalPrice = warehouses
        .map(warehouse => {
          // console.log("// 计算本地购物车总价", warehouse);
          return warehouse.data.reduce((prev, cur) => {
            let curPrice = cur.tmpSelected ? cur.tmpQty * cur.price : 0;
            return prev + curPrice;
          }, 0);
        })
        .reduce((prev, cur) => prev + cur, 0);
    } catch (error) {
      // console.log(error);
      console.log("跳走时reduce报错，暂时不知道为啥");
    }

    return (
      <View className="cart-page">
        {/* 购物车为空 */}
        {warehouses.length == 0 && (
          <View className="empty">
            <View style="margin-top: 250px">购物车为空</View>
            <Button type="primary" className="am-button" onClick={this.goHome}>
              立即去框框
            </Button>
          </View>
        )}

        {/* 购物车不为空 */}
        {warehouses.length != 0 && (
          <View className="isLogin">
            <ScrollView
              style={`height: ${getGlobalData("systemInfo").windowHeight -
                100}px`}
              scrollY
              scrollWithAnimation
            >
              {warehouses.map((item, index) => {
                const { name, data } = item;
                return (
                  <View key={`${name}${index}`}>
                    <View>{name}</View>
                    <View>
                      {data.map((goodsItem, index) => {
                        return (
                          <CartItem
                            key={index}
                            goods={goodsItem}
                            onDeleteGoods={this.props.removeFromCart.bind(this)}
                            onChangeGoodsQty={this.props.modifyCart.bind(this)}
                            onCheckboxClick={this.props.modifyCart.bind(this)}
                            // onChangeGoodsQty={this.changeGoodsQtyHandler.bind(
                            //   this,
                            //   goodsItem
                            // )}
                          />
                        );
                      })}
                    </View>
                  </View>
                );
              })}
              {/* <CartItem
              goods={cateItemDetails}
              onDeleteGoods={this.deleteGoodsHandler}
            /> */}
            </ScrollView>
            <View className="bottom-count" style={"bottom:0;"}>
              <View className="fj">
                <View>
                  合计：
                  <Text
                    className={!warehouses.length ? "disabled price" : "price"}
                  >
                    {totalPrice}
                  </Text>
                </View>
                <Button
                  className={!totalPrice ? "cart-btn-disable" : "cart-btn"}
                  onClick={this.checkOutHandler}
                  disabled={!totalPrice}
                >
                  结算
                </Button>
                {/* <View className="info">
                  不含运费
                </View> */}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Cart as ComponentClass<PageOwnProps, PageState>;
