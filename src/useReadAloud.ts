import { useCallback, useEffect, useRef, useState } from "react";

export type Options = {
  rate?: number;
  pitch?: number;
};

/* 
  The Web Speech API is unreliable with long utterances, so choosing a conservative chunk size 
  that avoids bugs and odd behavior in the Web Speech API across browsers. 
*/
const MAX_CHARS = 220;

function splitIntoChunks(text: string) {
  const chunks: string[] = [];
  let buffer = "";

  for (const sentence of text.split(".")) {
    if ((buffer + sentence + ".").length > MAX_CHARS) {
      chunks.push(buffer.trim());
      buffer = sentence + ".";
    } else {
      buffer += sentence + ".";
    }
  }

  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

export function useReadAloud(getText: () => string, options: Options = {}) {
  const { rate = 1, pitch = 1 } = options;

  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sessionRef = useRef(0);

  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  const resetQueue = useCallback(() => {
    queueRef.current = [];
    indexRef.current = 0;
  }, []);

  const initializeQueue = useCallback(() => {
    const raw = getText();
    if (!raw.trim()) return;

    const paragraphs = raw
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    queueRef.current = paragraphs.flatMap(splitIntoChunks);
    indexRef.current = 0;
  }, [getText]);

  // this is called to clean up the states - after reset
  const finish = useCallback(() => {
    setIsReading(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    speechSynthesis.cancel();
    resetQueue();
    finish();
  }, [resetQueue, finish]);

  const speakChunk = useCallback(() => {
    const sessionId = sessionRef.current;

    // everything is read out
    if (indexRef.current >= queueRef.current.length) {
      finish();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      queueRef.current[indexRef.current]
    );
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      if (sessionId !== sessionRef.current) {
        return;
      }

      // read next chunk at the end of every chunk
      indexRef.current += 1;
      speakChunk();
    };

    utterance.onerror = () => {
      if (sessionId !== sessionRef.current) {
        return;
      }
      reset();
    };

    speechSynthesis.speak(utterance);
  }, [finish, reset, pitch, rate]);

  const start = useCallback(() => {
    reset();
    /* 
      Invalidate old callbacks (onEnd, onError) - when starting a speech.
      This prevents the "onError" callbacks to be invoked if we are interrupting the previous speech 
    */
    sessionRef.current += 1;

    setIsReading(true);
    setIsPaused(false);

    initializeQueue();

    speakChunk();
  }, [initializeQueue, speakChunk]);

  const pause = useCallback(() => {
    setIsPaused(true);

    speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);

    /* 
      Invalidate old callbacks (onEnd, onError) - when resuming a speech.
      This prevents the "onError" callbacks to be invoked if we are interrupting the previous speech 
    */
    sessionRef.current += 1;

    /*
      We are expected to use this, but it is failing to resume - after long pauses
      speechSynthesis.resume();

      so, a workaround for this is used here - cancelling and starting the speech manually
    */
    speechSynthesis.cancel();
    speakChunk();
  }, [speakChunk]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return {
    isReading,
    isPaused,
    start,
    reset,
    pause,
    resume,
    toggle: isReading ? (isPaused ? resume : pause) : start,
  };
}
