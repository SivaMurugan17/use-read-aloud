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

function AudioPlayer({ text }: { text: string }) {
  const { isReading, isPaused, toggle, start, reset } = useReadAloud(
    () => text,
    { rate: 1 }
  );

  return (
    <div>
      <button onClick={toggle}>
        {isReading && !isPaused ? "Pause" : "Play"}
      </button>

      {isReading && <button onClick={start}>Restart</button>}
      <button onClick={reset}>Stop</button>
    </div>
  );
}
```

## API

```
useReadAloud(getText, options?)
```

### Parameters

- getText - A function that returns the text to read.

- options

```ts
type Options = {
  rate?: number; // default: 1
  pitch?: number; // default: 1
};
```

### Returns

```ts
{
  isReading: boolean;
  isPaused: boolean;
  start: () => void;
  toggle: () => void;
  reset: () => void;
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

## License

MIT
