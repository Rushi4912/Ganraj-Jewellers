import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: "/blog" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Care Guide", href: "/care" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "FAQ", href: "/faq" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#2D2A26] text-[#E5E0D8] overflow-hidden pt-24 pb-12">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D2A26] via-[#8B7355] to-[#2D2A26]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column - Span 4 */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-serif tracking-wider uppercase text-white group-hover:text-[#B8923A] transition-colors duration-300">
                  Ganraj
                </span>
                <div className="w-1.5 h-1.5 bg-[#B8923A] rounded-full mt-2"></div>
              </div>
              <span className="text-[10px] tracking-[0.3em] text-[#8B7355] uppercase block mt-1">
                Jewellers Est. 1990
              </span>
            </Link>
            <p className="text-[#E5E0D8]/60 text-sm leading-relaxed max-w-sm font-light">
              Crafting legacies throughout generations. A destination for those who seek the extraordinary in every detail.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={`social-${index}`}
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#E5E0D8]/10 flex items-center justify-center text-[#E5E0D8]/60 hover:text-white hover:border-[#B8923A] hover:bg-[#B8923A] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 - Span 2 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium mb-8">Essence</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#E5E0D8]/70 hover:text-[#B8923A] transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#B8923A] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 - Span 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium mb-8">Assistance</h4>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#E5E0D8]/70 hover:text-[#B8923A] transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-[#B8923A] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column - Span 3 */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium mb-8">Visit Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group cursor-pointer">
                <MapPin size={18} className="text-[#8B7355] mt-1 flex-shrink-0 group-hover:text-[#B8923A] transition-colors" />
                <span className="text-sm text-[#E5E0D8]/70 leading-relaxed group-hover:text-white transition-colors">
                  Ganraj Jewellers, Bhalgaon Pathardi,<br /> Ahmednagar, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <Phone size={18} className="text-[#8B7355] flex-shrink-0 group-hover:text-[#B8923A] transition-colors" />
                <span className="text-sm text-[#E5E0D8]/70 group-hover:text-white transition-colors">+91 8308088608</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <Mail size={18} className="text-[#8B7355] flex-shrink-0 group-hover:text-[#B8923A] transition-colors" />
                <span className="text-sm text-[#E5E0D8]/70 group-hover:text-white transition-colors">ganrajjewellers3@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E5E0D8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#E5E0D8]/40 tracking-wide">
            &copy; 2025 Ganraj Jewellers. All rights reserved.
          </p>
          <div className="flex gap-1 text-[#E5E0D8]/40 text-xs tracking-wide">
            <span>Designed with</span>
            <span className="text-[#8B7355]">Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

