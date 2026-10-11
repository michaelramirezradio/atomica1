import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, Check, Sparkles, Radio } from 'lucide-react';

interface CabinaMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: string;
  currentArtist: string;
}

export const CabinaMessageModal: React.FC<CabinaMessageModalProps> = ({
  isOpen,
  onClose,
  currentSong,
  currentArtist,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Petición musical');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const targetEmail = 'programacion@atomica.uno';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Compose mailto link
    const subject = encodeURIComponent(`[Atómica 1 Radio] ${category} - ${name || 'Oyente'}`);
    const bodyContent = `Hola equipo de Atómica 1 Radio:\n\n${message}\n\n---\nDetalles del oyente:\nNombre: ${name || 'Anónimo'}\nUbicación: ${location || 'No especificada'}\nTipo: ${category}\nCanción en antena al enviar: "${currentSong}" de ${currentArtist}\n`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // Open mail client
    window.location.href = mailtoUrl;

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
      setMessage('');
    }, 2800);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1022] border border-[#262b4d] rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1c203b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white tracking-wide">
                Mensaje en Directo a la Radio
              </h3>
              <p className="text-xs text-slate-400">
                Contacta directamente con la cabina de Atómica 1 Radio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Toast */}
        {isSent ? (
          <div className="my-8 p-6 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">¡Mensaje Preparado para Cabina!</h4>
            <p className="text-xs text-emerald-300">
              Se ha redactado tu mensaje dirigido a <span className="font-mono font-semibold underline">{targetEmail}</span>. Gracias por formar parte de Atómica 1 Radio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Direct Email Badge */}
            <div className="flex items-center justify-between p-2.5 bg-[#14172f] border border-[#282d54] rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-300 truncate">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Correo de programación:</span>
                <span className="font-mono text-cyan-300 font-semibold">{targetEmail}</span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                className="px-2.5 py-1 bg-[#1e2345] hover:bg-[#282e5c] text-slate-200 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                {copiedEmail ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            {/* Currently Playing context banner */}
            <div className="p-2.5 bg-[#12142a] rounded-xl border border-[#1f2343] flex items-center gap-2.5 text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
              <span className="truncate">
                Sonando ahora: <strong className="text-white">{currentSong}</strong> · {currentArtist}
              </span>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tu Nombre o Apodo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Alex / RadioFan"
                  className="w-full px-3 py-2 bg-[#12152b] border border-[#24294d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ciudad o País
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Madrid, CDMX, Bogotá..."
                  className="w-full px-3 py-2 bg-[#12152b] border border-[#24294d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Motivo del Mensaje
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#12152b] border border-[#24294d] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              >
                <option value="Petición musical">Petición musical / Dedicatoria</option>
                <option value="Saludo a la cabina">Saludo a la cabina</option>
                <option value="Sugerencia de programación">Sugerencia de temas o bombazos</option>
                <option value="Comentario o reporte">Comentario general de la emisión</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tu Mensaje o Dedicatoria <span className="text-cyan-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu dedicatoria, canción que te gustaría escuchar o mensaje a los locutores..."
                className="w-full px-3 py-2 bg-[#12152b] border border-[#24294d] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:from-cyan-400 hover:to-fuchsia-400 rounded-xl shadow-lg shadow-fuchsia-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar a programacion@atomica.uno</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
