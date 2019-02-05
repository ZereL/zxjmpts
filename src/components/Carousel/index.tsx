import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { IMAGE_URL } from "../../config";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = { images: any };

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Carousel {
  props: IProps;
}

// TODO: Taro支不支持把这个组件改为pure function???
class Carousel extends Component {
  componentDidShow() {
    console.log("进入这个组件");
  }
  render() {
    const { images } = this.props;
    return (
      <Swiper
        className="swiper"
        circular
        indicatorDots
        indicatorColor="#999"
        indicatorActiveColor="#bf708f"
        autoplay
      >
        {images.map((item, index) => (
          <SwiperItem key={index} className="image">
            <Image
              mode="scaleToFill"
              className="img"
              src={`${IMAGE_URL}${item.image}`}
            />
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}

export default Carousel as ComponentClass<PageOwnProps, PageState>;
