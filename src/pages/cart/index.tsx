/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:17
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-19 10:51:44
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login, fetchPageData, modifyCart } from "../../actions";
import { CART } from "../../constants";
import { getGlobalData } from "../../utils/common";
import CartItem from "../../components/CartItem";

type PageStateProps = {
  cart: {
    warehouses: any;
  };
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
  modifyCart: (namespace: string, payload?: any) => any;
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
    modifyCart: modifyCart
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

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { warehouses } = this.props.cart;
    console.log("warehouses", warehouses);
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
                          onDeleteGoods={this.deleteGoodsHandler}
                          onChangeGoodsQty={this.props.modifyCart.bind(this)}
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
          </View>
        )}
      </View>
    );
  }
}

export default Cart as ComponentClass<PageOwnProps, PageState>;
