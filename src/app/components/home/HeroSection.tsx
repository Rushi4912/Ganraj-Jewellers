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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ========== LEFT COLUMN ========== */}
          <div className="pt-8 lg:pt-16">

            {/* Main Headline */}
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.75rem] font-normal text-gray-900 leading-[1.05] tracking-tight mb-8 uppercase animate-fadeInUp"
            >
              <span className="block">The Pinnacle</span>
              <span className="block">of Jewelry</span>
              <span className="block">Craftsmanship</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 text-base lg:text-lg mb-10 max-w-[400px] leading-relaxed animate-fadeInUp-delay-1">
              Explore the unique world of our jewelry, where sophistication intertwines with perfection
            </p>

            {/* Category Pills + Signature Wrapper */}
            <div className="relative mb-14">
              <div className="flex flex-wrap gap-4 animate-fadeInUp-delay-2 relative z-10">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="px-8 py-2.5 rounded-full border border-[#D0C9C0] bg-transparent text-sm font-medium text-[#8A7E72] hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Curved Arrow Signature */}
              <div className="absolute left-[320px] -top-8 animate-fadeInUp-delay-2 hidden lg:block">
                <svg
                  width="130"
                  height="100"
                  viewBox="0 0 130 100"
                  fill="none"
                  className="text-gray-400 transform rotate-12"
                >
                  <path
                    d="M10 20 Q 80 0, 100 80"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M90 75 L 100 80 L 108 72"
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
            <div className="space-y-8">
              {/* Small Rectangular Image */}
              <div className="w-32 h-16 rounded-[20px] overflow-hidden shadow-lg animate-fadeInUp-delay-3 bg-gray-200">
                <div className="relative w-full h-full">
                  <Image
                    src="/hero/small.jpeg"
                    alt="Detail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Three Circular Images */}
              <div className="flex items-center gap-6 animate-fadeInUp-delay-3">
                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#F2F0EB] shadow-md z-30 bg-white">
                    <Image
                      src="/hero/small3.jpg"
                      alt="Jewelry 1"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#F2F0EB] shadow-md z-20 bg-white">
                    <Image
                      src="/hero/small.jpeg"
                      alt="Jewelry 2"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#F2F0EB] shadow-md z-10 bg-white">
                    <Image
                      src="/hero/small2.jpeg"
                      alt="Jewelry 3"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="font-display italic text-2xl text-[#6B6054] leading-none">
                  <span className="block">Explore</span>
                  <span className="block">the unique</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RIGHT COLUMN - IMAGES ========== */}
          <div className="relative h-[600px] lg:h-[750px] w-full mt-10 lg:mt-0">

            {/* LABEL: "Elegance in Every Detail" */}
            <div className="absolute top-12 left-0 z-30 animate-fadeInRight text-left">
              <p className="text-gray-500 text-sm tracking-wide">Elegance in</p>
              <p className="text-[#C59D5F] text-sm font-medium tracking-wide">Every Detail</p>
            </div>

            {/* IMAGE 1: Top Right (Woman with earring) - big2.jpg */}
            <div
              className="absolute top-0 right-0 z-10 animate-floatSubtle2"
              style={{ width: '380px', height: '520px' }}
            >
              <div className="w-full h-full rounded-[100px_100px_40px_100px] overflow-hidden shadow-2xl bg-gray-200">
                <Image
                  src="/hero/big2.jpg"
                  alt="Earring Model"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* IMAGE 2: Bottom Left overlapping (Ring box) - big.jpg */}
            <div
              className="absolute bottom-20 left-4 z-20 animate-floatSubtle"
              style={{ width: '340px', height: '420px' }}
            >
              <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-[#F2F0EB] bg-gray-200">
                <Image
                  src="/hero/big.jpg"
                  alt="Ring Box"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* LABEL: "Create Your Own Perspective" */}
            <div className="absolute bottom-40 -right-4 z-30 animate-fadeInRight-delay-1 text-left">
              <p className="text-[#C59D5F] text-sm leading-tight">Create Your</p>
              <p className="text-[#C59D5F] text-sm leading-tight">Own</p>
              <p className="text-gray-800 text-sm font-semibold leading-tight mt-1">Perspective</p>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-8 h-12 rounded-full border border-gray-400 flex items-center justify-center opacity-60">
          <div className="w-px h-3 bg-gray-600 animate-scrollBounce" />
        </div>
      </div>
    </section>
  );
}