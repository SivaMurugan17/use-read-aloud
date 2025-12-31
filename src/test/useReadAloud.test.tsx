import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReadAloud } from "../useReadAloud";

const TEXT = `
Hello world.
This is a test blog.
It has multiple paragraphs.
`;

describe("useReadAloud", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts reading", () => {
    const { result } = renderHook(() => useReadAloud(TEXT));

    act(() => {
      result.current.play();
    });

    expect(result.current.isPaused).toBe(false);
    expect(speechSynthesis.speak).toHaveBeenCalled();
  });

  it("pauses reading", () => {
    const { result } = renderHook(() => useReadAloud(TEXT));

    act(() => {
      result.current.play();
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);
    expect(speechSynthesis.pause).toHaveBeenCalled();
  });

  it("resumes reading after pause", () => {
    const { result } = renderHook(() => useReadAloud(TEXT));

    act(() => {
      result.current.play();
      result.current.pause();
      result.current.play();
    });

    expect(result.current.isPaused).toBe(false);
    expect(speechSynthesis.cancel).toHaveBeenCalled();
    expect(speechSynthesis.speak).toHaveBeenCalled();
  });

  it("replays reading", () => {
    const { result } = renderHook(() => useReadAloud(TEXT));

    act(() => {
      result.current.play();
      result.current.replay();
    });

    expect(result.current.isPaused).toBe(false);
    expect(speechSynthesis.cancel).toHaveBeenCalled();
    expect(speechSynthesis.speak).toHaveBeenCalled();
  });

  it("does nothing if text is empty", () => {
    const { result } = renderHook(() => useReadAloud(""));

    act(() => {
      result.current.play();
    });

    expect(speechSynthesis.speak).not.toHaveBeenCalled();
  });
});
