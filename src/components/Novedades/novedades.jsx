import { Box, Image } from "@chakra-ui/react";
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/b1.jpg';
import banner3 from '../../assets/banner3.jpg';
import banner4 from '../../assets/bingoprox.jpg';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function Novedades() {
  const banners = [
    { id: 1, src: banner1, alt: "Banner 1" },
    { id: 2, src: banner2, alt: "Banner 2" },
    { id: 3, src: banner3, alt: "Banner 3" },
    { id: 4, src: banner4, alt: "Banner 4" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box
      w="100%" 
      h="auto"
      m="0 auto"
      borderRadius="10px"
      overflow="hidden"
      mt={2}
      pl="5px"
      pr="5px"
      pt="5px"
      
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box
            key={banner.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="100%"
            h="auto"
          >
            <Image
              borderRadius="10px"
              w="100%"
              h="auto"
              objectFit="cover"
              src={banner.src}
              alt={banner.alt}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)" // Aplica un sombreado predefinido (puedes ajustarlo)
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
