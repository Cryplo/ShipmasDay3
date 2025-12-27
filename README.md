# Light Symphony

An interactive Christmas visualization where you paint festive lights with sound. Make noise to light up a snowy house - quiet sounds create green lights, loud sounds create red lights, and everything in between produces warm yellows and oranges.

## The Idea

Every Christmas light on the house starts dark. When you click "Start", the app begins listening to your microphone and lights up 4 bulbs per second (40 total over 10 seconds). The color of each light is determined by how loud you are at that exact moment:

- **Quiet** → Green
- **Medium** → Yellow/Orange
- **Loud** → Red

The result is a unique "sound painting" on the house that reflects your voice, claps, music, or any sound you make. When all 40 lights are lit, sparkles celebrate your creation.

## Features

- Falling snow animation in the background
- House silhouette with 40 individually controllable lights
- Real-time microphone input via Web Audio API
- Smooth light fade-in animations with glow effects
- Volume meter showing current input level
- Progress bar tracking lit lights
- Celebration sparkle effect on completion
- Graceful microphone permission handling

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project
3. Vercel will auto-detect Next.js and deploy

Or use the Vercel CLI:

```bash
npx vercel
```

## How It Works

1. **Audio Capture**: Uses the Web Audio API to request microphone access and create an AnalyserNode
2. **Volume Analysis**: Samples frequency data at 60fps and calculates average amplitude
3. **Color Mapping**: Converts volume (0-1) to HSL hue (120° green → 0° red)
4. **Light Sequence**: Interval timer triggers one light every 250ms, sampling current volume for color
5. **Animations**: CSS keyframes handle snow fall, light glow, and sparkle effects

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Web Audio API (no external audio libraries)

## Browser Support

Works in modern browsers that support:
- `navigator.mediaDevices.getUserMedia()`
- `AudioContext` and `AnalyserNode`
- CSS animations and transitions

Note: Microphone access requires HTTPS in production (localhost works for development).

---

Built for Shipmas 2025
