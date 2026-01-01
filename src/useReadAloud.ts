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

export function useReadAloud(text: string, options: Options = {}) {
  const { rate = 1, pitch = 1 } = options;

  const [isPaused, setIsPaused] = useState(true);
  const isPausedRef = useRef(true);

  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  const resetQueue = useCallback(() => {
    queueRef.current = [];
    indexRef.current = 0;
  }, []);

  const initializeQueue = useCallback(() => {
    if (!text.trim()) {
      return;
    }

    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    queueRef.current = paragraphs.flatMap(splitIntoChunks);
    indexRef.current = 0;
  }, [text]);

  const finish = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);

    // reset to the start of the queue, if everything is read
    indexRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    speechSynthesis.cancel();
    resetQueue();
    finish();
  }, [resetQueue, finish]);

  const speakChunk = useCallback(() => {
    // everything is read out
    if (indexRef.current >= queueRef.current.length) {
      finish();
      return;
    }

    // speak current utterance
    const utterance = new SpeechSynthesisUtterance(
      queueRef.current[indexRef.current]
    );
    utterance.rate = rate;
    utterance.pitch = pitch;
    speechSynthesis.speak(utterance);

    // callbacks
    utterance.onend = () => {
      // read next chunk at the end of every chunk
      indexRef.current += 1;
      speakChunk();
    };

    utterance.onerror = () => {
      // do nothing
    };
  }, [finish, pitch, rate]);

  const pause = useCallback(() => {
    setIsPaused(true);
    isPausedRef.current = true;

    speechSynthesis.pause();
  }, []);

  const play = useCallback(() => {
    setIsPaused(false);
    isPausedRef.current = false;

    // if we are starting freshly
    if (queueRef.current.length === 0) {
      initializeQueue();
    }

    /*
      speechSynthesis.resume();
      We are expected to use this, but it is failing to resume after long pauses.
      So, a workaround for this is used here - cancelling and starting the speech manually.
    */
    speechSynthesis.cancel();
    speakChunk();
  }, [speakChunk, initializeQueue]);

  const replay = useCallback(() => {
    reset();
    play();
  }, [reset, play]);

  const seekBackward = useCallback(() => {
    indexRef.current = Math.max(indexRef.current - 1, 0);
    if (!isPausedRef.current) {
      play();
    }
  }, [play]);

  const fastForward = useCallback(() => {
    indexRef.current = Math.min(
      indexRef.current + 1,
      queueRef.current.length - 1
    );
    if (!isPausedRef.current) {
      play();
    }
  }, [play]);

  // handle rate changes
  useEffect(() => {
    if (isPausedRef.current) {
      speechSynthesis.cancel();
    } else {
      play();
    }
  }, [rate, play]);

  // clean up
  useEffect(() => {
    return () => reset();
  }, [reset]);

  return {
    isPaused,
    play,
    pause,
    replay,
    seekBackward,
    fastForward,
    togglePlay: isPaused ? play : pause,
  };
}
