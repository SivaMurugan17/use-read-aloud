# use-read-aloud

A lightweight React hook for reliable text-to-speech (read aloud) in the browser. Designed for long-form content like blogs and articles using the Web Speech API.

This hook is designed to work around common Web Speech API issues such as:

- Random failures when reading long text
- Unreliable behavior when resuming after long pauses
- Missing controls like fast-forward, rewind, etc.

> Note : This works fully on the client side using the browser’s built-in text-to-speech engines.
> No external APIs or dependencies are required.

## Installation

```bash
npm install use-read-aloud
```

## Usage

```tsx
import { useReadAloud } from "use-read-aloud";

function AudioPlayer() {
  const { isPaused, togglePlay } = useReadAloud("Text to be read");

  return (
    <>
      <button onClick={togglePlay}>{isPaused ? "Play" : "Pause"}</button>
    </>
  );
}
```

## Demo

A live demo can be found in [this blog](https://pragmaticswe.com/post/escaping-the-new-year-resolutions-matrix), which uses this library under the hood.

## API

```
useReadAloud(text, options?)
```

### Parameters

- text - the text to be read

- options - additional options to change the rate and pitch of the speech

```ts
type Options = {
  rate?: number; // default: 1
  pitch?: number; // default: 1
};
```

### Returns

```ts
{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
  replay: () => void;
  seekBackward: () => void;
  fastForward: () => void;
  togglePlay: () => void;
}
```

## Examples

1. Fast forward / seek backward

```tsx
import { useReadAloud } from "use-read-aloud";

function AudioPlayer() {
  const { isPaused, togglePlay, fastForward, seekBackward } =
    useReadAloud("Text to be read");

  return (
    <>
      <button onClick={seekBackward}>Rewind</button>
      <button onClick={togglePlay}>{isPaused ? "Play" : "Pause"}</button>
      <button onClick={fastForward}>FastForward</button>
    </>
  );
}
```

2. Speed up / slow down

```tsx
import { useReadAloud } from "use-read-aloud";
import { useState } from "react";

function AudioPlayer() {
  const [playBackSpeed, setPlayBackSpeed] = useState<number>(1);

  const { isPaused, togglePlay } = useReadAloud("Text to be read", {
    rate: playBackSpeed,
  });

  return (
    <>
      <button onClick={togglePlay}>{isPaused ? "Play" : "Pause"}</button>
      <span>
        <button onClick={() => setPlayBackSpeed(playBackSpeed - 0.25)}>
          Minus
        </button>
        {`${playBackSpeed}x`}
        <button onClick={() => setPlayBackSpeed(playBackSpeed + 0.25)}>
          Plus
        </button>
      </span>
    </>
  );
}
```

3. Replay from the start

```tsx
import { useReadAloud } from "use-read-aloud";

function AudioPlayer() {
  const { isPaused, togglePlay, replay } = useReadAloud("Text to be read");

  return (
    <>
      <button onClick={togglePlay}>{isPaused ? "Play" : "Pause"}</button>
      <button onClick={replay}>Replay</button>
    </>
  );
}
```

## Behavior

- Long text is automatically split into smaller chunks of sentences for reliability.
- A workaround is used as a replacement for the inconsistent `speechSynthesis.resume()` function. (This may restart the current sentence, which is generally acceptable and far more reliable.)

## Peer dependency

- react >= 18

## Browser support

This hook uses the browser built-in Web Speech API, which is supported by most modern browsers. But, the voice quality varies by browser.

Supported:

- Chrome

- Edge

- Safari

Not supported:

- Firefox (does not support the Web Speech API)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md)

## License

MIT
