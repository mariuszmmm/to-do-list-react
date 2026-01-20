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
export const useSpeechToText = ({ prevText }: { prevText?: string }) => {
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

    const recog = new SpeechRecognition();

    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = getSpeechLang();

    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
    
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

    // Handle speech recognition errorss
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
  const start = useCallback(
    (prevText?: string) => {
      prevText && (finalTextRef.current = prevText);
      recognitionRef.current?.start();
    },
    [recognitionRef],
  );

  // Stop speech recognition
  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Clear speech text and refs
  const clear = useCallback(() => {
    setText("");
    interimTextRef.current = "";
    finalTextRef.current = "";
    hasCheckedInterim.current = false;
    isInterimSupported.current = false;
  }, []);

  return {
    text,
    isListening,
    isActive,
    isInterimSupported: isInterimSupported.current,
    supportSpeech,
    start,
    stop,
    clear,
    setText,
  };
};
