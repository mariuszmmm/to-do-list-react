import { useEffect, useRef, useState } from "react";
import { prepareText } from "../utils/prepareText";
import i18n from "../utils/i18n";
import { langCodes } from "../utils/i18n/languageResources";

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
    recog.lang = langCodes[i18n.language as keyof typeof langCodes];

    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
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

    recog.onerror = async (event) => {
      console.error("Speech recognition error: ", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recog;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    recognitionRef.current.lang =
      langCodes[i18n.language as keyof typeof langCodes];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const start = () => {
    finalTextRef.current = prevText;
    recognitionRef.current?.start();
  };

  const stop = () => recognitionRef.current?.stop();

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
