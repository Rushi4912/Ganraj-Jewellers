"use client";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <Link href="/shop" className="block w-full group cursor-pointer">
      {/* Reduced height to better fit typical banner dimensions */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden py-20">
        
        {/* 1. Full Screen Banner Image as Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/banner.png"
            alt="Silver Anklet Banner"
            fill
            className="object-cover object-center" 
            priority
            quality={100}
          />
          {/* Subtle overlay to ensure text readability if needed, otherwise transparent */}
          <div className="absolute inset-0 bg-black/5 md:bg-transparent pointer-events-none" />
        </div>

      
        <style jsx global>{`
          .font-serif {
            font-family: 'Playfair Display', serif;
          }
        `}</style>
      </section>
    </Link>
  );
}