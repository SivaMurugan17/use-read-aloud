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

  it("starts reading and sets isReading", () => {
    const { result } = renderHook(() => useReadAloud(() => TEXT));

    act(() => {
      result.current.start();
    });

    expect(result.current.isReading).toBe(true);
    expect(speechSynthesis.speak).toHaveBeenCalled();
  });

  it("pauses reading", () => {
    const { result } = renderHook(() => useReadAloud(() => TEXT));

    act(() => {
      result.current.start();
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);
    expect(speechSynthesis.pause).toHaveBeenCalled();
  });

  it("resumes reading after pause", () => {
    const { result } = renderHook(() => useReadAloud(() => TEXT));

    act(() => {
      result.current.start();
      result.current.pause();
      result.current.resume();
    });

    expect(result.current.isPaused).toBe(false);
    expect(speechSynthesis.cancel).toHaveBeenCalled();
    expect(speechSynthesis.speak).toHaveBeenCalled();
  });

  it("resets reading", () => {
    const { result } = renderHook(() => useReadAloud(() => TEXT));

    act(() => {
      result.current.start();
      result.current.reset();
    });

    expect(result.current.isReading).toBe(false);
    expect(speechSynthesis.cancel).toHaveBeenCalled();
  });

  it("does nothing if text is empty", () => {
    const { result } = renderHook(() => useReadAloud(() => ""));

    act(() => {
      result.current.start();
    });

    expect(result.current.isReading).toBe(false);
    expect(speechSynthesis.speak).not.toHaveBeenCalled();
  });
});
