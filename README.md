# use-read-aloud

A lightweight React hook that adds text-to-speech (read aloud) functionality using the Web Speech API.

This hook is designed for blogs, articles, and reading-focused applications.

## Installation

```bash
npm install use-read-aloud
```

## Peer dependency

- react >= 18

## Usage

```tsx
import { useReadAloud } from "use-read-aloud";
import { useState } from "react";
import {
  FastForward,
  Minus,
  Pause,
  Play,
  Plus,
  Rewind,
  RotateCcw,
  Volume2,
} from "lucide-react";

function AudioPlayer({ text }: { text: string }) {
  const [playBackSpeed, setPlayBackSpeed] = useState<number>(1);

  const { isPaused, togglePlay, fastForward, seekBackward, replay } =
    useReadAloud(text, {
      rate: playBackSpeed,
    });

  return (
    <div>
      <button onClick={seekBackward}>
        <Rewind />
      </button>
      <button onClick={togglePlay}>{isPaused ? <Play /> : <Pause />}</button>
      <button onClick={fastForward}>
        <FastForward />
      </button>
      <button onClick={replay}>
        <RotateCcw />
      </button>
      <span>
        <button onClick={() => setPlayBackSpeed(playBackSpeed - 0.25)}>
          <Minus />
        </button>
        {`${playBackSpeed}x`}
        <button onClick={() => setPlayBackSpeed(playBackSpeed + 0.25)}>
          <Plus />
        </button>
      </span>
    </div>
  );
}
```

## API

```
useReadAloud(text, options?)
```

### Parameters

- text - the text to be read.

- options - options to specify rate and pitch of the speech

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

## Behavior

- Long text is automatically split into smaller chunks for reliability

- Speech is cancelled automatically when the component unmounts

- Pause and resume are handled safely using internal session tracking

## Browser support

This hook uses the Web Speech API.

Supported:

- Chrome

- Edge

- Safari

Not supported:

- Firefox

## Changelog

See [CHANGELOG.md](./CHANGELOG.md)

## License

MIT
