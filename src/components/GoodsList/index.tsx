/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:07:36 
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-07 15:59:38
 */
import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import { IMAGE_URL } from "../../config/index";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = { list: any; loading?: any };

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsList {
  props: IProps;
}

class GoodsList extends Component {
  gotoDetail = e => {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${e.currentTarget.dataset.id}`
    });
  };

  render() {
    const { list, loading } = this.props;
    return (
      <View className="goods-list-container">
        {list.length > 0 ? (
          <View className="goods-ul">
            {list.map((item, index) => (
              <View
                key={index}
                className="goods-li"
                data-id={item.content.id}
                onClick={this.gotoDetail}
              >
                <View className="pos">
                  <View className="Image-container">
                    <Image
                      mode="aspectFit"
                      style='width: 172px;height: 250px;background: #fff;' // TODO: 这里为什么使用className就改变不了样式？？？？？？？
                      // className="img"
                      src={
                        item.content.image
                          ? `${IMAGE_URL}${
                              item.content.image
                            }?width=300&constrain=true&bgcolor=white`
                          : ""
                      }
                    />
                  </View>
                  {/* {item.mode_id == 3 &&
                    (item.enabled != 1 || item.sale_stock == 0) && (
                      <View className="sold-out">
                        <View className="sales-end">已售罄</View>
                      </View>
                    )}
                  {item.enabled &&
                    item.enabled != 0 &&
                    item.enabled != 1 &&
                    item.enabled != 2 && (
                      <View className="unable">
                        <View className="sales-end">下架</View>
                      </View>
                    )} */}
                </View>
                <View className="zan-capsule">
                  {/* {item.type_id == 2 && item.mode_id == 1 && (
                    <View className="zan-capsule__left">VIP</View>
                  )}
                  {item.limit_tag && item.limit_tag != "" && (
                    <View className="zan-capsule__center">
                      {item.limit_tag}
                    </View>
                  )} */}
                  {item.content.price && (
                    <View className="zan-capsule__right">
                      ¥
                      {item.content.price}
                    </View>
                  )}
                </View>
                {/* <Text className="dark">{item.brand}</Text> */}
                <Text>{item.content.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View />
        )}
        {loading && (
          <View className="loadMoreGif">
            <View className="zan-loading" />
            <View className="text">加载中...</View>
          </View>
        )}
      </View>
    );
  }
}

export default GoodsList as ComponentClass<PageOwnProps, PageState>;
