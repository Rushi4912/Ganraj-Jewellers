import { Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-gray-900 text-white shadow-2xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full text-sm uppercase tracking-[0.4em]">
              <Sparkles size={18} />
              Latest in atelier
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Be the first to receive launches, styling diaries, and private previews.
            </h2>
            <p className="text-white/70 text-base">
              Once a week, beautifully curated stories—crafted to elevate your jewelry wardrobe.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-white rounded-[28px] shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-900 font-semibold">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Mail size={24} />
                </div>
                Exclusive dispatches
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 font-semibold shadow-lg shadow-amber-500/30">
                  Become a muse
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center md:text-left">
                Zero spam, only artistry. Opt out anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
