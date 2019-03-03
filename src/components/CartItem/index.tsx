/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:32
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-19 12:31:16
 */
import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { Image, View, Checkbox } from "@tarojs/components";
import { AtInputNumber } from "taro-ui";
import "./index.scss";
import { IMAGE_URL, cdnSmallSuffix, cdnMediumSuffix } from "../../config";
import { MODIFY_TEMP_CART_THEN_UPDATE } from "../../constants/index";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = {
  goods: any;
  onDeleteGoods: any;
  onChangeGoodsQty: any;
};

type PageState = {
  itemQty: number;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface CartItem {
  props: IProps;
}

// TODO: Taro支不支持把这个组件改为pure function???
class CartItem extends Component {
  state = {
    itemQty: 0
  };
  componentDidShow() {
    console.log("进入这个组件");
  }

  // itemQtyChangeHandler(value, goods) {
  //   // this.setState({ itemQty: value });
  //   console.log("value", value);
  //   this.props.onChangeGoodsQty({
  //     type: `cart/${MODIFY_TEMP_CART_THEN_UPDATE}`,
  //     payload: {
  //       warehouseId: goods.warehouseId,
  //       id: goods.skuId,
  //       qty: value,
  //       selected: true
  //     }
  //   });
  // }

  // warehouseId: this.props.goods.warehouseId,
  // id: this.props.goods.skuId,
  // qty: value,
  // selected: true

  itemQtyChangeHandler(value) {
    console.log("value", value);
    console.log("parseInt(value)", parseInt(value));
    console.log("this", this);

    this.props.onChangeGoodsQty("cart", {
      warehouseId: this.props.goods.warehouseId,
      id: this.props.goods.skuId,
      qty: parseInt(value),
      selected: true
    });
  }

  itemQtyBlurHandler(event) {
    console.log("event", event);
  }

  getCount = () => {
    return this.state.itemQty;
  };

  deleteHandler() {
    console.log("delete");
    console.log("this", this);

    console.log("onDeleteGoods", this.props.onDeleteGoods);

    this.props.onDeleteGoods("cart", {
      id: this.props.goods.skuId
    });
  }

  render() {
    const { goods, onDeleteGoods } = this.props;
    return (
      <View className="ClothingsItem-page">
        <View className="WhiteSpace" />
        <View className="hr" />
        <View key={goods.goodsId}>
          <View className="WhiteSpace" />
          <View className="clothing">
            <View className="shop-img">
              <Image
                mode="widthFix"
                src={`${IMAGE_URL}${goods.image}${cdnSmallSuffix}`}
              />
            </View>
            <View className="content">
              <View className="info p">{goods.name}</View>
              {/* <View className="title p">{item.brand}</View> */}
              <View className="title p">
                ￥ {goods.price} {goods.hasStock ? "有货" : "无货"}{" "}
                <AtInputNumber
                  type="number"
                  min={0}
                  max={10}
                  step={1}
                  value={goods.tmpQty}
                  // value={this.state.itemQty}
                  onChange={this.itemQtyChangeHandler.bind(this)} // 这个onChange是直接把value取到的值+1或者-1
                  onBlur={this.itemQtyBlurHandler.bind(this)}
                />
              </View>

              {/* <View className="size p">
                  {`${item.spu} | ${item.specification || "均码"}`}
                </View> */}
              {/* <View className="size p" ></View> */}
            </View>
            <View className="edit">
              <View
                className="iconfont icon-delete"
                data-id={goods.goodsId}
                // onClick={onDeleteGoods}
                onClick={this.deleteHandler.bind(this)}
              />
            </View>
          </View>
          <View className="WhiteSpace" />
          <View className="hr" />
        </View>
      </View>
    );
  }
}

export default CartItem as ComponentClass<PageOwnProps, PageState>;
