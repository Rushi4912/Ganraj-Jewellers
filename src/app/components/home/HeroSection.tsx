"use client";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Gold", href: "/collections/necklaces" },
  { name: "Diamonds", href: "/collections/rings" },
  { name: "Care", href: "/about" },
];

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#F2F0EB',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-16"> {/* Reduced padding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ========== LEFT COLUMN ========== */}
          <div className="pt-4 lg:pt-12">

            {/* Main Headline - REDUCED SIZE */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-normal text-gray-900 leading-[1.05] tracking-tight mb-6 uppercase"
            >
              <span className="block animate-fadeInUp">The Pinnacle</span>
              <span className="block animate-fadeInUp-delay-1">of Jewelry</span>
              <span className="block animate-fadeInUp-delay-2 text-[#8B7355]">Craftsmanship</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-[400px] leading-relaxed animate-fadeInUp-delay-2">
              Explore the unique world of our jewelry, where sophistication intertwines with perfection
            </p>

            {/* Category Pills + Signature Wrapper */}
            <div className="relative mb-10">
              <div className="flex flex-wrap gap-3 animate-fadeInUp-delay-3 relative z-10">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="px-6 py-2 rounded-full border border-[#C5B4A5] bg-transparent text-sm font-medium text-[#6B5D52] hover:bg-[#2D2A26] hover:text-white hover:border-[#2D2A26] transition-all duration-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Simple Curved Arrow */}
              <div className="absolute left-[260px] -top-8 animate-fadeInUp-delay-2 hidden lg:block opacity-60">
                <svg
                  width="100"
                  height="80"
                  viewBox="0 0 100 80"
                  fill="none"
                  className="text-gray-500 transform rotate-12"
                >
                  <path
                    d="M10 20 Q 60 0, 80 60"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M70 55 L 80 60 L 88 52"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Small Rectangular Image & Circular Images Group */}
            <div className="space-y-6">
              {/* Small Rectangular Image - FIXED BORDER RADIUS */}
              <div
                className="w-28 h-14 shadow-lg animate-fadeInUp-delay-3 bg-[#E5E0D8] border border-white relative overflow-hidden"
                style={{ borderRadius: '24px 4px 24px 4px' }}
              >
                <Image
                  src="/hero/small.jpeg"
                  alt="Detail"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Three Circular Images */}
              <div className="flex items-center gap-5 animate-fadeInUp-delay-3">
                <div className="flex -space-x-3">
                  {[
                    { src: "/hero/small3.jpg", z: 30 },
                    { src: "/hero/small.jpeg", z: 20 },
                    { src: "/hero/small2.jpeg", z: 10 }
                  ].map((img, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 rounded-full overflow-hidden border-[3px] border-[#F2F0EB] shadow-md z-${img.z} bg-white transition-transform hover:-translate-y-1 duration-300`}
                    >
                      <Image
                        src={img.src}
                        alt={`Jewelry ${i}`}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <div className="font-display italic text-xl text-[#5A4D41] leading-none">
                  <span className="block">Explore</span>
                  <span className="block text-[#8B7355]">the unique</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RIGHT COLUMN - IMAGES ========== */}
          <div className="relative h-[550px] lg:h-[650px] w-full mt-8 lg:mt-0">

            {/* LABEL: "Elegance in Every Detail" */}
            <div className="absolute top-8 left-0 z-30 animate-fadeInRight text-left mix-blend-multiply">
              <p className="text-[#6B5D52] text-xs tracking-widest uppercase font-semibold">Elegance in</p>
              <p className="text-[#B8923A] text-base font-display italic">Every Detail</p>
            </div>

            {/* IMAGE 1: Top Right (Woman) - big2.jpg - FIXED BORDER RADIUS */}
            <div
              className="absolute top-0 right-0 z-10 animate-floatSubtle2"
              style={{ width: '340px', height: '460px' }} // Reduced size
            >
              <div
                className="relative w-full h-full shadow-2xl bg-[#E5E0D8] group overflow-hidden"
                style={{ borderRadius: '100px 100px 20px 100px' }}
              >
                <Image
                  src="/hero/big2.jpg"
                  alt="Earring Model"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* IMAGE 2: Bottom Left overlapping (Ring box) - big.jpg - FIXED BORDER RADIUS */}
            <div
              className="absolute bottom-12 left-4 z-20 animate-floatSubtle"
              style={{ width: '300px', height: '380px' }} // Reduced size
            >
              <div
                className="relative w-full h-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-4 border-[#F2F0EB] bg-[#E5E0D8] group overflow-hidden"
                style={{ borderRadius: '40px 80px 40px 80px' }}
              >
                <Image
                  src="/hero/big.jpg"
                  alt="Ring Box"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* LABEL: "Create Your Own Perspective" */}
            <div className="absolute bottom-24 -right-2 z-30 animate-fadeInRight-delay-1 text-left">
              <p className="text-[#8B7355] text-xs leading-tight font-medium">Create Your</p>
              <p className="text-[#8B7355] text-xs leading-tight font-medium">Own</p>
              <p className="text-[#2D2A26] text-lg font-display italic mt-1">Perspective</p>
            </div>

          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gray-400 to-transparent">
            <div className="w-full h-1/2 bg-gray-800 animate-scrollBounce" />
          </div>
        </div>
      </div>
    </section>
  );
}