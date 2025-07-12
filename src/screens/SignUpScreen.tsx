import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { register, loading, error } = useApp();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!email || !password || !name) {
      setFormError("Bitte fülle alle Felder aus.");
      return;
    }
    try {
      await register(email, password, name);
      navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
    } catch (err: any) {
      setFormError(err.message || "Registrierung fehlgeschlagen");
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-end items-center bg-[#141414] overflow-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* 9:16 Video Background (placeholder URL) */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Placeholder video URL
        autoPlay
        loop
        muted
        playsInline
        style={{ aspectRatio: "9/16" }}
      />

      {/* Overlay for darkening video */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Sign Up Panel */}
      <div className="relative z-20 w-full max-w-[420px] mx-auto mb-12 px-4">
        <div className="backdrop-blur-md bg-black/60 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg">
          {/* Placeholder for Logo and marketing copy */}
          <div className="flex flex-col items-center mb-2">
            <div className="h-10 mb-2 w-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">Logo</div>
            <span className="text-white text-lg font-bold tracking-wide">Rise</span>
            <span className="text-[#ff6a00] text-xs font-medium mt-1">500,000+ members</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-base">★★★★★</span>
              <span className="text-xs text-white/80">(4.7)</span>
            </div>
          </div>

          {/* Sign Up Buttons or Email Form */}
          {!showEmailForm ? (
            <>
              <button className="w-full h-12 rounded-full bg-white text-black font-bold text-base mb-1 shadow transition hover:bg-[#ff6a00] hover:text-white" disabled>
                <span className="truncate">Mit Apple fortfahren</span>
              </button>
              <button className="w-full h-12 rounded-full bg-[#303030] text-white font-bold text-base mb-1 shadow transition hover:bg-[#ff6a00]" disabled>
                <span className="truncate">Mit Google fortfahren</span>
              </button>
              <button className="w-full h-12 rounded-full bg-[#303030] text-white font-bold text-base shadow transition hover:bg-[#ff6a00]" onClick={() => setShowEmailForm(true)}>
                <span className="truncate">Mit E-Mail fortfahren</span>
              </button>
            </>
          ) : (
            <form className="w-full flex flex-col gap-3" onSubmit={handleEmailSignUp}>
              <input
                className="w-full h-12 rounded-full px-5 bg-[#222] text-white placeholder:text-[#ababab] text-base outline-none border-none"
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <input
                className="w-full h-12 rounded-full px-5 bg-[#222] text-white placeholder:text-[#ababab] text-base outline-none border-none"
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="w-full h-12 rounded-full px-5 bg-[#222] text-white placeholder:text-[#ababab] text-base outline-none border-none"
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {(formError || error) && (
                <div className="text-red-400 text-xs text-center">{formError || error}</div>
              )}
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#ff6a00] text-white font-bold text-base shadow transition hover:bg-[#ff8c1a] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Registrieren...' : 'Registrieren'}
              </button>
              <button
                type="button"
                className="w-full h-12 rounded-full bg-[#303030] text-white font-bold text-base shadow transition hover:bg-[#474747]"
                onClick={() => setShowEmailForm(false)}
                disabled={loading}
              >
                Zurück
              </button>
            </form>
          )}

          {/* Optional: Register later or restore progress */}
          <div className="flex flex-col items-center mt-2 w-full">
            <span className="text-white/70 text-xs mb-1">oder <span className="underline cursor-pointer">Später registrieren</span></span>
            <a href="#" className="text-[#ff6a00] text-xs underline">Fortschritt wiederherstellen</a>
          </div>
        </div>
      </div>
    </div>
  );
} 