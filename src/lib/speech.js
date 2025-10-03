// Utilidades de voz
export function startSTT(onFinal) {
  const w = window;
  const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Rec) throw new Error("SpeechRecognition no soportado en este navegador");

  const rec = new Rec();
  rec.lang = "es-MX";
  rec.interimResults = true;
  rec.continuous = true;

  rec.onresult = (e) => {
    let final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        final += e.results[i][0].transcript;
      }
    }
    if (final) onFinal(final.trim());
  };

  rec.start();
  return rec;
}

export function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-MX";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
