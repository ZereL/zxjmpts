/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:32
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-26 17:32:27
 */
import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { IMAGE_URL, cdnMediumSuffix } from "../../config";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = {
  images: any;
  containerStyle?: string;
  imageStyle?: string;
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Carousel {
  props: IProps;
}

// TODO: Taro支不支持把这个组件改为pure function???
class Carousel extends Component {
  componentDidShow() {
    // console.log("进入这个组件");
  }
  render() {
    const { images, containerStyle, imageStyle } = this.props;
    return (
      <Swiper
        className={containerStyle ? "" : "swiper"}
        circular
        indicatorDots
        indicatorColor="#999"
        indicatorActiveColor="#bf708f"
        autoplay
        style={containerStyle}
      >
        {images.map((item, index) => (
          <SwiperItem
            key={index}
            className={imageStyle ? "" : "image"}
            style={imageStyle}
          >
            <Image
              mode={"widthFix"}
              className={imageStyle ? "" : "img"}
              style={imageStyle}
              src={`${IMAGE_URL}${item.image}${cdnMediumSuffix}`}
            />
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}

export default Carousel as ComponentClass<PageOwnProps, PageState>;
