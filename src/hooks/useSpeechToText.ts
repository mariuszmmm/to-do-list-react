import { useCallback, useEffect, useRef, useState } from "react";
import { prepareText } from "../utils/prepareText";
import i18n from "../utils/i18n";
import {
  defaultLanguage,
  langCodes,
  SupportedLanguages,
} from "../utils/i18n/languageResources";

/**
 * Hook for speech-to-text functionality using the Web Speech API.
 * Handles speech recognition, language, interim/final results, and error handling.
 */

// Prosta detekcja Androida
const isAndroid =
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

// Rozszerzenie typu SpeechRecognition o _forceStop (lokalnie w tym pliku)
type SpeechRecognitionWithForceStop = SpeechRecognition & {
  _forceStop?: boolean;
};

export const useSpeechToText = ({ prevText }: { prevText: string }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [supportSpeech, setSupportSpeech] = useState<boolean | null>(null);
  const hasCheckedInterim = useRef(false);
  const isInterimSupported = useRef(false);
  const interimTextRef = useRef("");
  const finalTextRef = useRef("");
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState("");

  const getSpeechLang = useCallback(() => {
    const rawLang = i18n.resolvedLanguage || i18n.language || defaultLanguage;
    const baseLang = (rawLang.split("-")[0] ||
      defaultLanguage) as SupportedLanguages;
    return langCodes[baseLang] || langCodes[defaultLanguage];
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportSpeech(false);
      return;
    }

    setSupportSpeech(true);

    const recog: SpeechRecognitionWithForceStop = new SpeechRecognition();

    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = getSpeechLang();

    recog.onstart = () => setIsListening(true);
    recog.onend = () => {
      setIsListening(false);
      // Automatyczne ponawianie na Androidzie, jeśli użytkownik nie zatrzymał ręcznie
      if (isAndroid && recog._forceStop !== true) {
        setTimeout(() => {
          try {
            recog.start();
          } catch {}
        }, 250);
      }
    };
    // Handle speech recognition results (interim and final)
    recog.onresult = (event) => {
      const result = event.results[event.resultIndex];

      if (!hasCheckedInterim.current) {
        isInterimSupported.current = !result.isFinal;
        hasCheckedInterim.current = true;
      }

      if (isInterimSupported.current) {
        setIsActive(false);
        interimTextRef.current = "";
        finalTextRef.current += text;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTextRef.current += transcript;
          } else {
            setIsActive(true);
            interimTextRef.current += transcript;
          }
        }

        setText(prepareText(finalTextRef.current + interimTextRef.current));
      } else {
        const transcript = result[0].transcript;
        setText(prepareText(finalTextRef.current + transcript));
      }
    };

    // Handle speech recognition errors
    recog.onerror = async (event) => {
      console.error("Speech recognition error: ", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recog;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSpeechLang]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    recognitionRef.current.lang = getSpeechLang();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSpeechLang, i18n.language]);

  // Start speech recognition with previous text
  const start = useCallback(() => {
    finalTextRef.current = prevText;
    if (recognitionRef.current) {
      // Flaga do ręcznego zatrzymania na Androidzie
      (recognitionRef.current as SpeechRecognitionWithForceStop)._forceStop =
        false;
      recognitionRef.current.start();
    }
  }, [prevText]);

  // Stop speech recognition
  const stop = useCallback(() => {
    if (recognitionRef.current) {
      (recognitionRef.current as SpeechRecognitionWithForceStop)._forceStop =
        true;
      recognitionRef.current.stop();
    }
  }, []);

  return {
    text,
    isListening,
    isActive,
    isInterimSupported: isInterimSupported.current,
    supportSpeech,
    start,
    stop,
  };
};
