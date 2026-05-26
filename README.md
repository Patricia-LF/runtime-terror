# Runtime Terror

A haunted house attraction built for the Yrgo Tivoli project. Enter if you dare — make your way through four rooms of horrors and see how scared you really are.

## Rooms

- **The Graveyard** — Your journey begins outside. The dead don't always stay buried.
- **The Doll Room** — Something is rocking in the corner. Click on it. It wants to talk to you.
- **The Spider Room** — Clear the webs to find your way out. But you are not alone.
- **The Clown Room** — He sees you. And he is getting closer.

## Tech Stack

- [Next.js](https://nextjs.org/) — App Router
- [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [CSS Modules](https://github.com/css-modules/css-modules) — sprite animations
- [Framer Motion](https://www.framer.com/motion/) — animations and transitions
- [Howler.js](https://howlerjs.com/) — audio management
- [Zustand](https://zustand-demo.pmnd.rs/) — global state management

## Project Structure
 
```
public/
└── assets/
    ├── audio/
    │   ├── ambient/              # Looping background sounds per room
    │   └── effect/               # One-shot sound effects
    ├── icons/
    ├── images/
    └── spider/                   # Spider sprite assets
 
src/
├── app/
│   ├── api/
│   │   ├── access/
│   │   │   └── route.ts          # Dev access cookie endpoint
│   │   ├── config/               
│   │   │   └── route.ts          # Read entry price from server
│   │   └── transaction/
│   │       └── route.ts          # Transaction API route — handles payment server-side
│   ├── haunted-house/
│   │   ├── end/
│   │   │   ├── loading.tsx       # Loading screen for end page
│   │   │   └── page.tsx          # End screen — shows stamp and result
│   │   ├── layout.tsx            # Haunted house layout — server-side access control
│   │   └── page.tsx              # Main game — handles room state and transitions
│   ├── favicon.ico
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── layout.tsx                # Root layout — fonts and providers
│   └── not-found.tsx             # 404 page
├── components/
│   ├── effects/                  # Animations and visual effects
│   │   ├── Bats.tsx              # Bat swarm animation with depth
│   │   ├── BatSprite.module.css  # CSS sprite animation for bat flap
│   │   ├── BatSprite.tsx         # Animated bat sprite component
│   │   ├── Fog.tsx               # Layered fog animation
│   │   ├── GhostLoop.tsx         # Looping ghost animation
│   │   ├── RockingChair.tsx      # Rocking doll with talk and jumpscare
│   │   ├── SpiderAnimation.module.css
│   │   ├── SpiderAnimation.tsx   # Spiders crawling animation
│   │   └── SpiderDrop.tsx        # Spider dropping from ceiling
│   ├── home-page/                # Home page components
│   │   ├── enter-form.tsx        # Entry form with payment button
│   │   └── home-client.tsx       # Home page logic and layout
│   ├── rooms/                    # One component per room
│   │   ├── room1/
│   │   │   ├── Graveyard.tsx     # Graveyard room with gravestones and zombie hand
│   │   │   └── ZombieHand.tsx    # Animated zombie hand emerging from ground
│   │   ├── room2/
│   │   │   └── Dolls.tsx         # Doll room with ambient laugh and key
│   │   ├── room3/
│   │   │   └── Spiders.tsx       # Spider room — remove webs to find key
│   │   ├── room4/
│   │   │   └── Clown.tsx         # Clown room — pop balloons to survive
│   │   └── HauntedHouseShell.tsx # Shared shell — ambient sound, exit button, mute
│   ├── shared/                   # Shared components used across rooms
│   │   ├── BackToTivoliButton.tsx # Returns user to Loopland via postMessage
│   │   ├── DescriptionButton.tsx  # Context-sensitive room help (WCAG 3.3.5)
│   │   ├── DoorTransition.tsx     # Animated door between rooms with fade overlay
│   │   ├── FadeOverlay.tsx        # Full-screen fade for room transitions
│   │   ├── HelpOverlay.tsx        # Global help overlay on home page
│   │   ├── KeyAppearing.tsx       # Golden key animation with sound
│   │   ├── LinkButton.tsx         # Accessible link styled as button
│   │   ├── ModalBase.tsx          # Reusable modal wrapper
│   │   └── RouteAmbientPlayer.tsx # Plays ambient sound based on current route
│   └── ui/                        # Generic UI components
│       ├── ErrorModal.tsx          # Error message modal
│       ├── ExitModal.tsx           # Exit confirmation modal
│       ├── LoadingScreen.tsx       # Loading screen with animated bar
│       ├── MuteButton.tsx          # Toggle mute for all audio
│       └── UnauthorizedModal.tsx   # Modal for 401 unauthorized errors
├── hooks/                          # Custom React hooks
│   ├── useAmbientController.ts     # Controls ambient sound crossfade between rooms
│   ├── useAudioUnlock.ts           # Unlocks audio context on first user interaction
│   ├── useEffectSounds.ts          # Triggers one-shot sound effects
│   ├── useIsMobile.ts              # Detects mobile viewport
│   ├── useTransaction.ts           # Handles payment flow with centralbank
│   └── useUrlParams.ts             # Reads and clears identity token from URL
├── lib/                            # Utility functions and configuration
│   ├── accessCookie.ts             # Access cookie name and value constants
│   ├── audio.ts                    # Sound map, room ambient config, SoundId types
│   ├── cookie.ts                   # Cookie get/set utilities
│   ├── gameConfig.ts               # Game configuration (TIVOLI_MODE etc.)
│   ├── parseError.ts               # Parses unknown errors to ApiError
│   ├── payment.ts                  # Calls centralbank POST /transactions
│   └── rooms.ts                    # Room help text for DescriptionButton
├── store/
│   ├── useAudioStore.ts            # Audio state — play, stop, fade, crossfade
│   ├── useFadeStore.ts             # Fade overlay state for room transitions
│   └── useGameStore.ts             # Room progression, stamp, game state
└── types/
    ├── errors.ts                   # ApiError type
    └── index.ts                    # Shared TypeScript types and interfaces
```

## Getting Started
 
```bash
# Install dependencies
npm install
 
# Run development server
npm run dev
 
# Build for production
npm run build
```
 
## Environment Variables
 
Create a `.env` file based on `.env.example`:
 
```
NEXT_PUBLIC_TIVOLI_MODE=false       # Set to true when connected to Loopland
ENTRY_PRICE=3                       # Entry fee used server-side for transaction
API_KEY=                            # Attraction API key from the centralbank
API_URL=https://api.loopland.se     # Centralbank API base URL
NEXT_PUBLIC_TIVOLI_URL=             # Loopland URL for BackToTivoliButton fallback
```
 
## Centralbank Integration
 
Runtime Terror is built as an attraction for the Yrgo Tivoli. When `NEXT_PUBLIC_TIVOLI_MODE` is set to `true`, the attraction integrates with the Loopland centralbank API.
 
### Authentication
 
The centralbank handles all user authentication — no login is built into the attraction itself. Users log in to Loopland and are redirected to the attraction with a short-lived `identity_token` in the URL:
 
```
https://runtime-terror.vercel.app/?identity_token=<token>
```
 
The token is read from the URL and immediately removed with `history.replaceState`. It is valid for 30 minutes and can be used for one stamp.
 
### User Flow
 
1. User logs in to Loopland with their name and access key
2. Loopland redirects the user to the attraction with an `identity_token` in the URL
3. The attraction reads and removes the token from the URL
4. *(Optional)* `GET /identity-tokens/{token}` — fetch user details to greet the player. Does not consume the token
5. User pays the entrance fee via `POST /transactions` with `{ identity_token, api_key }` — token is consumed and a stamp is returned
6. The haunted house experience runs
7. On completion the user receives their stamp and is shown the end screen
### API Endpoints
 
| Method | Endpoint                   | Body                        | Notes                            |
|--------|----------------------------|-----------------------------|----------------------------------|
| `GET`  | `/identity-tokens/{token}` | —                           | Optional, does not consume token |
| `POST` | `/transactions`            | `{ identity_token, api_key }` | Consumes token, returns stamp  |
 
### Error Handling
 
On `401` (expired or already used token) the user is shown a clear error message with a link back to Loopland. On `402` (insufficient funds) the user is informed they do not have enough balance.
 
### iframe Integration
 
Runtime Terror runs inside a Loopland iframe modal. To close the modal and return the user to Loopland, the `BackToTivoliButton` uses `postMessage`:
 
```typescript
window.parent.postMessage({ type: "AMUSEMENT_CLOSE" }, "https://loopland.se")
```
 
The `vercel.json` at the project root configures the `Content-Security-Policy` header to allow framing from Loopland:
 
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://loopland.se/"
        }
      ]
    }
  ]
}
```
 
## Group
 
Built by [Marie Färnström](https://github.com/mariefarnstrom), [Patricia Loayza Frykberg](https://github.com/Patricia-LF) and [Malin Persson](https://github.com/Malinsson) as part of the Yrgo WU25 Tivoli project.
