# Changelog

## 1.0.0

### Changed

- Simplified the hook API by accepting `text: string` directly instead of a `getText()` callback.
- Unified playback control into `play` and `pause`, removing the separate `start` / `resume` distinction.
- Removed session-based callback invalidation logic to reduce complexity.
- Added `replay`, `fastForward`, `seekBackward` fetaures.
- Added handling rate change - in flight - while speaking or at rest - during pause.

### Removed

- `isReading` state in favor of a simpler `isPaused` model.
- Control-flow logic inside `utterance.onerror` (now treated as a no-op).

### Notes

- Calling `speechSynthesis.cancel()` may still trigger browser callbacks; this hook intentionally avoids using `onerror` for control flow to ensure stability.
