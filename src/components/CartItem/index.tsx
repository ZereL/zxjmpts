/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:32
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-18 13:56:17
 */
import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { AtInputNumber } from "taro-ui";
import "./index.scss";
import { IMAGE_URL, cdnSmallSuffix, cdnMediumSuffix } from "../../config";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = {
  goods: any;
  onDeleteGoods: any;
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

  itemQtyChangeHandler(value) {
    this.setState({ itemQty: value });
  }

  itemQtyBlurHandler(event) {
    console.log("event", event);
  }
  render() {
    const { goods, onDeleteGoods } = this.props;
    return (
      <View className="ClothingsItem-page">
        <View className="WhiteSpace" />
        <View className="hr" />
        {goods.map(item => (
          <View key={item.goodsId}>
            <View className="WhiteSpace" />
            <View className="clothing">
              <View className="shop-img">
                <Image
                  mode="widthFix"
                  src={`${IMAGE_URL}${item.image}${cdnSmallSuffix}`}
                />
              </View>
              <View className="content">
                <View className="info p">{item.name}</View>
                {/* <View className="title p">{item.brand}</View> */}
                <View className="title p">
                  ￥ {item.price} {item.hasStock ? "有货" : "无货"}{" "}
                  <AtInputNumber
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    value={this.state.itemQty}
                    onChange={this.itemQtyChangeHandler.bind(this)}
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
                  data-id={item.goodsId}
                  onClick={onDeleteGoods}
                />
              </View>
            </View>
            <View className="WhiteSpace" />
            <View className="hr" />
          </View>
        ))}
      </View>
    );
  }
}

export default CartItem as ComponentClass<PageOwnProps, PageState>;
