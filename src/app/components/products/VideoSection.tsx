import React from "react";
import { ShoppingCart } from "lucide-react";

const videos = [
  {
    src: "/videos/video1.mp4",
    title: "Elegant Necklace",
    price: "$299",
  },
  {
    src: "/videos/video2.mp4",
    title: "Diamond Ring",
    price: "$499",
  },
  {
    src: "/videos/video3.mp4",
    title: "Gold Bracelet",
    price: "$199",
  },
  {
    src: "/videos/video4.mp4",
    title: "Silver Earrings",
    price: "$149",
  },
  {
    src: "/videos/video5.mp4",
    title: "Pearl Collection",
    price: "$349",
  },
];

const VideoSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-16">
      {/* Headline */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wide mb-3 text-gray-900">
          Jewellery in Motion
        </h2>
        <p className="text-gray-500 text-sm md:text-base tracking-wider uppercase">
          Experience our craftsmanship through elegant showcases
        </p>
      </div>

      {/* Video Products */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-6 px-4 max-w-7xl mx-auto">
        {videos.map((video, index) => (
          <div
            key={index}
            className="group w-full sm:w-[48%] md:w-[30%] lg:w-[18%] bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden bg-gray-100">
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>

        
            <div className="p-4">
              <h3 className="font-serif text-lg text-gray-900 mb-1 tracking-wide">
                {video.title}
              </h3>
              <p className="text-xl font-light text-gray-800 mb-4 tracking-wide">
                {video.price}
              </p>

              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors duration-200 group/button">
                <ShoppingCart className="w-3 h-3 group-hover/button:scale-110 transition-transform" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoSection;
