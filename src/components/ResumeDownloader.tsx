import React from 'react';
import { Download } from 'lucide-react';

export default function ResumeDownloader() {
  return (
    <a
      href="/Ankush_Gupta_Resume.pdf"
      download="Ankush_Gupta_Resume.pdf"
      className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 border border-zinc-800 bg-zinc-950/95 transition-all duration-300 hover:text-white hover:border-[#FF6B00] shadow-xl fluid-hover-btn active:scale-[0.98] flex items-center gap-2 group cursor-pointer"
      id="cta-download-cv"
      title="Download Ankush Gupta's Resume (Pristine PDF)"
    >
      <Download className="w-3.5 h-3.5 text-emerald-500 transition-transform duration-300 group-hover:scale-125 group-hover:translate-y-0.5" />
      <span>DOWNLOAD_CV</span>
    </a>
  );
}
