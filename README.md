# wupf-radio

First-pass WUPF radio homepage.

## Run locally

Serve this directory with any static web server and open `index.html` through it.

## Connect the live stream

Set the verified stream URL in `index.html` on the `#live-audio` element:

```html
<audio id="live-audio" preload="none" data-stream-url="https://your-stream.example/live"></audio>
```

The first-pass player handles idle, connecting/buffering, playing, paused, and error states. The next player milestone should add a distinct station-offline state, automatic reconnect with capped backoff, live metadata/track updates, and an explicit autoplay-blocked message.
