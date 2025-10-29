"use client";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://assets.ajio.com/medias/sys_master/root/20240504/crXa/6635b9a705ac7d77bb3dedb2/-473Wx593H-467299538-white-MODEL.jpg',
      alt: 'Elegant woman wearing gold jewelry'
    },
    {
      image: 'https://i.pinimg.com/236x/c6/ab/d4/c6abd448b9740ff1a0a87df6bd0f67c8.jpg',
      alt: 'Beautiful woman with diamond necklace'
    },
    {
      image: 'https://i.pinimg.com/originals/a0/98/0d/a0980dad0e1c42cb68d556bf6d0f6700.jpg',
      alt: 'Stylish woman wearing pearl jewelry'
    },
    {
      image: 'https://thumbs.dreamstime.com/b/silver-gold-new-year-jewelry-festive-numbers-realistic-form-jewelry-stores-banner-stunning-image-showcases-356437777.jpg',
      alt: 'Glamorous woman with luxury jewelry'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZCQzAyRCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="absolute top-20 right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 lg:pr-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-amber-200">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-700 tracking-wide uppercase">
                Best of the Best
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Gold Earrings
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                For Women
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Indulge yourself. Reward your life & make you bright with our exquisite collection
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-full hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 flex items-center gap-2 font-semibold text-lg transform hover:scale-105">
                SHOP NOW
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 font-semibold text-lg backdrop-blur-sm">
                VIEW COLLECTION
              </button>
            </div>

            <div className="flex items-center gap-12 pt-8">
              <div>
                <div className="text-4xl font-bold text-gray-900">2000+</div>
                <div className="text-gray-600 font-medium">Products</div>
              </div>
              <div className="h-16 w-px bg-gray-300"></div>
              <div>
                <div className="text-4xl font-bold text-gray-900">15K+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="h-16 w-px bg-gray-300"></div>
              <div>
                <div className="text-4xl font-bold text-gray-900">4.9</div>
                <div className="text-gray-600 font-medium">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-3xl transform scale-75 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-lg" style={{ perspective: '1000px' }}>
              <div className="relative overflow-visible h-[600px]">
                {slides.map((slide, index) => {
                  const offset = index - currentSlide;
                  const absOffset = Math.abs(offset);

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 transition-all duration-700 ease-in-out"
                      style={{
                        transform: `
                          translateX(${offset * 100}px)
                          translateZ(${-absOffset * 200}px)
                          rotateY(${offset * 25}deg)
                          scale(${1 - absOffset * 0.2})
                        `,
                        opacity: absOffset === 0 ? 1 : absOffset === 1 ? 0.5 : 0,
                        zIndex: slides.length - absOffset,
                        pointerEvents: offset === 0 ? 'auto' : 'none',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="relative overflow-hidden rounded-3xl shadow-2xl h-full">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft size={24} className="text-gray-900" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <ChevronRight size={24} className="text-gray-900" />
              </button>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 backdrop-blur-sm z-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">30% OFF</div>
                    <div className="text-sm text-gray-600">Limited Offer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
