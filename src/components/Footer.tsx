import React from 'react';
import { Radio, Github, Mail } from 'lucide-react';
import logoBadgeUrl from '../assets/images/atomica_logo_badge_1791734290868.jpg';

interface FooterProps {
  onOpenMessageModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMessageModal }) => {
  return (
    <footer className="border-t border-[#1b1f3d] bg-[#060714] py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/30">
              <img src={logoBadgeUrl} alt="Atómica 1" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">
                ATÓMICA 1 RADIO
              </p>
              <p className="text-[11px] text-slate-400">
                La Descubre Bombazos · Transmisión Digital 24/7
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://str1.mediatelekom.net:8049/stream"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Stream Directo
            </a>
            <button
              onClick={onOpenMessageModal}
              className="hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-fuchsia-400" />
              programacion@atomica.uno
            </button>
            <a
              href="https://github.com/atomicauno"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub: atomicauno
            </a>
          </div>

          {/* Open source notice */}
          <div className="text-slate-400 text-center md:text-right">
            <p>© {new Date().getFullYear()} Atómica 1 Radio. Todos los derechos reservados.</p>
            <p className="text-[11px] mt-0.5 text-slate-500">
              Reproductor web libre de costes mensuales y sin APIs de facturación.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
