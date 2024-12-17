import { useState, useEffect } from "react";

export const useSpeechRecognition = (setMessageInput) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      speechRecognition.lang = "en-US";
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;

      // Set the state once recognition is initialized
      setRecognition(speechRecognition);
    } else {
      console.error("Speech Recognition is not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (!recognition) return;

    recognition.start();
    setIsListening(true);

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessageInput(transcript); // Update the message input with speech recognition result
      console.log("Recognized speech:", transcript);
    };

    recognition.onerror = (event) => {
      console.error("Error in speech recognition:", event.error);
      setIsListening(false); // Reset state in case of error
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false); // Reset state when recognition ends
    };
  };

  const stopListening = () => {
    if (recognition && isListening) {
        recognition.stop();
        setIsListening(false); // Update the state when recognition is stopped
      }
  };

  return { isListening, startListening, stopListening };
};