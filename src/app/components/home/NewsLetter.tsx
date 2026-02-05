import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: '#F2F0EB' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-[#2D2A26] shadow-2xl">
          {/* Background Pattern/Texture if needed, or keeping it clean dark */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8B7355] opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            {/* Text Content */}
            <div className="flex-1 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#8B7355]/30 bg-[#8B7355]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8923A] font-medium">The Private List</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-[#F2F0EB] leading-tight">
                Join the <span className="italic text-[#8B7355]">Atelier</span>
              </h2>

              <p className="text-[#E5E0D8]/70 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                Be the first to receive collection launches, styling diaries, and private showroom invitations.
              </p>
            </div>

            {/* Input Form */}
            <div className="w-full max-w-md">
              <form className="flex flex-col gap-4">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-[#F2F0EB]/5 border border-[#8B7355]/30 rounded-full px-6 py-4 text-[#F2F0EB] placeholder-[#E5E0D8]/30 focus:outline-none focus:border-[#8B7355] focus:bg-[#F2F0EB]/10 transition-all duration-300"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full bg-[#8B7355] hover:bg-[#B8923A] flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-[#B8923A]/20 hover:scale-105"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-[#E5E0D8]/40 uppercase tracking-wider text-center lg:text-right px-2">
                  Exclusively curated • Unsubscribe anytime
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

