import { vi } from "vitest";

class MockUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  lang?: string;
  onend?: () => void;
  onerror?: () => void;

  constructor(text: string) {
    this.text = text;
  }
}

const speak = vi.fn((utterance) => {
  // simulate async speech finishing
  setTimeout(() => {
    utterance.onend?.();
  }, 0);
});

globalThis.SpeechSynthesisUtterance = MockUtterance as any;

globalThis.speechSynthesis = {
  speak,
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
} as any;
