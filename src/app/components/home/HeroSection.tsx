"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Slide {
  image: string;
  alt: string;
  kicker: string;
  headline: string;
}

const slides: Slide[] = [
  {
    image: "https://assets.ajio.com/medias/sys_master/root/20240504/crXa/6635b9a705ac7d77bb3dedb2/-473Wx593H-467299538-white-MODEL.jpg",
    alt: "Elegant woman wearing gold jewellery",
    kicker: "Ganraj Signature",
    headline: "Bridal Couture",
  },
  {
    image: "https://i.pinimg.com/236x/c6/ab/d4/c6abd448b9740ff1a0a87df6bd0f67c8.jpg",
    alt: "Beautiful woman with diamond necklace",
    kicker: "Limited Release",
    headline: "Diamond Collection",
  },
  {
    image: "https://i.pinimg.com/originals/a0/98/0d/a0980dad0e1c42cb68d556bf6d0f6700.jpg",
    alt: "Stylish woman wearing pearl jewellery",
    kicker: "Exclusive Collection",
    headline: "Pearl Luxury",
  },
  {
    image: "https://thumbs.dreamstime.com/b/silver-gold-new-year-jewelry-festive-numbers-realistic-form-jewelry-stores-banner-stunning-image-showcases-356437777.jpg",
    alt: "Glamorous woman with luxury jewellery",
    kicker: "Timeless Elegance",
    headline: "Gold Essentials",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (nextSlideOrFn: number | ((prev: number) => number)) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(nextSlideOrFn);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const nextSlide = () => {
    handleSlideChange((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    handleSlideChange((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    handleSlideChange(index);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white min-h-[85vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content - Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-sm border border-amber-200/80 px-5 py-2.5 rounded-full">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-xs font-semibold tracking-[0.35em] text-amber-700 uppercase">
                Ganraj Jewellers
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Crafted in Pune,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">
                worn across the world
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              For 25 years our atelier has translated family rituals and modern silhouettes into
              collectible jewellery—blending polki, diamonds and pearls with impeccable finish.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/collections"
                className="group bg-gray-900 text-white px-8 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
              >
                Explore collections
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-gray-300 text-gray-900 px-8 py-3.5 rounded-full text-sm font-semibold hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                Book private viewing
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 lg:gap-12 pt-6 text-sm text-gray-600">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">25+</div>
                <p className="text-sm">Years of craft</p>
              </div>
              <div className="h-16 w-px bg-gray-200 hidden sm:block" />
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">4.9/5</div>
                <p className="text-sm">Client rating</p>
              </div>
              <div className="h-16 w-px bg-gray-200 hidden sm:block" />
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">15k+</div>
                <p className="text-sm">Families styled</p>
              </div>
            </div>
          </div>

          {/* Right Carousel - Cinematic */}
          <div className="relative lg:pl-8">
            <div className="relative h-[500px] w-full max-w-md mx-auto lg:ml-auto overflow-hidden rounded-3xl shadow-2xl">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                      isActive 
                        ? "opacity-100 z-10 scale-100" 
                        : "opacity-0 z-0 scale-110"
                    }`}
                    style={{
                      transitionProperty: "opacity, transform",
                    }}
                  >
                    <div 
                      className={`w-full h-full ${
                        isActive ? "animate-ken-burns" : ""
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.headline}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                    
                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                    
                    {/* Animated Content */}
                    <div className={`absolute bottom-0 left-0 right-0 p-6 text-white space-y-2 transition-all duration-1000 ${
                      isActive 
                        ? "translate-y-0 opacity-100 delay-300" 
                        : "translate-y-8 opacity-0"
                    }`}>
                      <p className="text-xs tracking-[0.4em] uppercase text-white/90 font-semibold backdrop-blur-sm inline-block px-3 py-1 rounded-full bg-white/10">
                        {slide.kicker}
                      </p>
                      <h2 className="text-3xl lg:text-4xl font-bold leading-tight drop-shadow-2xl">
                        {slide.headline}
                      </h2>
                      <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
                    </div>
                  </div>
                );
              })}

              {/* Navigation Buttons */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 z-20 pointer-events-none">
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md text-gray-900 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md text-gray-900 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "w-10 bg-gradient-to-r from-amber-400 to-orange-500"
                        : "w-1.5 bg-white/50 hover:bg-white/75"
                    } disabled:cursor-not-allowed`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Film grain effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay z-30">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
              </div>
            </div>

            {/* Decorative Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-2xl p-5 border-4 border-white z-30 hidden lg:block animate-pulse-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <div className="text-white">
                  <div className="text-xl font-bold">30% OFF</div>
                  <div className="text-xs opacity-90">Limited Offer</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
