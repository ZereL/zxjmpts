import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { IMAGE_URL } from "../../config";

type PageStateProps = {};

type PageDispatchProps = {};

type PageOwnProps = { banner: any };

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Slider {
  props: IProps;
}

// TODO: Taro支不支持把这个组件改为pure function???
class Slider extends Component {
  render() {
    console.log("进入slider");
    const { banner } = this.props;
    console.log('banner', banner);
    return (
      <Swiper
        className="swiper "
        circular
        indicatorDots
        indicatorColor="#999"
        indicatorActiveColor="#bf708f"
        autoplay
      >
        {banner.map((item, index) => (
          <SwiperItem key={index}>
            {/* <Image mode="widthFix" src={`${IMAGE_URL}${item.image}`} /> */}
            <Image
              mode="widthFix"
              src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
            />
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}

export default Slider as ComponentClass<PageOwnProps, PageState>;
