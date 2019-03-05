/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 16:00:50
 */
import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import { IMAGE_URL } from "../../config/index";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = { list: any; loading?: any; tagList?: any };

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface ZXJGoodsList {
  props: IProps;
}

class ZXJGoodsList extends Component {
  gotoDetail = e => {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${e.currentTarget.dataset.id}`
    });
  };

  render() {
    const { list, loading, tagList } = this.props;
    console.log("list", list);
    return (
      <View className="goods-list-container">
        {list.length > 0 ? (
          <View className="goods-ul">
            {list.map((item, index) => (
              <View
                key={index}
                className="goods-li"
                data-id={item.id}
                onClick={this.gotoDetail}
              >
                <View className="pos">
                  <View className="Image-container">
                    <Image
                      mode="aspectFit"
                      style="width: 172px;height: 172px;background: #fff;" // TODO: 这里为什么使用className就改变不了样式？？？？？？？
                      // className="img"
                      src={
                        item.image
                          ? `${IMAGE_URL}${
                              item.image
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
                {/* <Text className="dark">{item.brand}</Text> */}
                <Text>{item.name}</Text>
                <View className="zan-capsule">
                  {item.tags &&
                    item.tags.map((tagsItem, index) => {
                      // console.log("tagsItem", tagsItem);
                      // 从tagList中匹配tags中的ID， 拿到带有tags的信息。
                      const selectedTag = tagList.filter(tagListItem => {
                        return tagListItem.tagId == tagsItem;
                      });
                      // console.log("selectedTag", selectedTag);
                      return (
                        <View className="zan-capsule__left">
                          {selectedTag[0].name}
                        </View>
                      );
                      // 我勒个去，selectTag[0]就能渲染出来，好吧，数据结构想错了？？？
                    })}
                </View>
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

export default ZXJGoodsList as ComponentClass<PageOwnProps, PageState>;
