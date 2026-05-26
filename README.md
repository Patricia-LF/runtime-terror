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
src/
├── app/
│   ├── api/
│   │   ├── access/
│   │   │   └── route.ts          # Dev access cookie endpoint
│   │   └── transaction/
│   │       └── route.ts          # Transaction API route
│   ├── haunted-house/
│   │   ├── end/
│   │   │   └── page.tsx          # End screen
|   |   |   └── loading.tsx        # Loading screen 
│   │   ├── layout.tsx            # Haunted house layout
│   │   └── page.tsx              # Main game — handles room state
│   ├── favicon.ico
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── layout.tsx                # Root layout — fonts and providers
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page — wraps HomeClient in Suspense
├── components/
│   ├── effects/                  # Animations and visual effects
│   │   ├── Bats.tsx
│   │   ├── BatSprite.module.css
│   │   ├── BatSprite.tsx
│   │   ├── Fog.tsx
│   │   ├── GhostLoop.tsx
│   │   ├── RockingChair.tsx
│   │   ├── SpiderAnimation.module.css
│   │   ├── SpiderAnimation.tsx
│   │   └── SpiderDrop.tsx
│   ├── home-page/                # Home page components
│   │   ├── enter-form.tsx        # Entry form with payment
│   │   └── home-client.tsx       # Home page logic and layout
│   ├── rooms/                    # One component per room
│   │   ├── room1/Graveyard.tsx, ZombieHand.tsx
│   │   ├── room2/Dolls.tsx
│   │   ├── room3/Spiders.tsx
│   │   ├── room4/Clown.tsx
│   │   └── HauntedHouseShell.tsx # Shared room shell and layout      
│   ├── shared/                   # Shared components
│   │   ├── BackToTicoliButton.tsx # Closes iframe
│   │   ├── DescriptionButton.tsx # Opens room descriptions
│   │   ├── DoorTransition.tsx    # Animated door between rooms
│   │   ├── FadeOverlay.tsx
│   │   ├── HelpOverlay.tsx       # Global help overlay
│   │   ├── KeyAppearing.tsx
│   │   ├── LinkButton.tsx
│   │   ├── ModalBase.tsx
│   │   └── RouteAmbiantPlayer.tsx # 
│   └── ui/                       # Generic UI components
│   │   ├── ErrorModal.tsx
│   │   ├── ExitModal.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── MuteButton.tsx
│   │   └── UnauthorizedModal.tsx # Modal for 401 errors
├── hooks/                        # Custom React hooks
│   ├── useAmbientController.ts
│   ├── useAudioUnlock.ts        # 
│   ├── useEffectSounds.ts        # Handles effect sounds
│   ├── useIsMobile.ts
│   ├── useTransaction.ts         # Handles payment flow
│   └── useUrlParams.ts           # Reads identity token from URL
├── lib/                          # Utility functions and configuration
│   ├── accessCookie.ts           # Dev access cookie logic
│   ├── audio.ts                  # Sound map and audio configuration
│   ├── cookie.ts                 # Cookie utilities
│   ├── gameConfig.ts             # Game configuration
│   ├── parseError.ts             # Error parsing utilities
│   ├── payment.ts                # Payment logic
│   └── rooms.ts                  # Room configuration
├── store/
│   ├── useAudioStore.ts          # Audio state management
│   ├── useFadeStore.ts
│   └── useGameStore.ts           # Room progression and game state
└── types/
    ├── errors.ts                 # Error types
    └── index.ts                  # Shared TypeScript types and interfaces
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

Create a `.env.local` file based on `.env.example`:

```
NEXT_PUBLIC_TIVOLI_MODE=false       # Set to true when connected to the main tivoli
NEXT_PUBLIC_ENTRY_PRICE=3           # Entry fee in euros
API_KEY=                            # Your attraction API key — get it from the centralbank after registering your amusement
```

## Centralbank Integration

Runtime Terror is built as an attraction for the Yrgo Tivoli. When `NEXT_PUBLIC_TIVOLI_MODE` is set to `true`, the attraction integrates with the centralbank API.

### Authentication

The centralbank handles all user authentication — no login is built into the attraction itself. Users log in to the main tivoli site and are redirected to the attraction with a short-lived `identity_token` in the URL:

```
https://runtime-terror.vercel.app/?identity_token=<token>
```

The token is read from the URL and immediately removed with `history.replaceState`. It is valid for 5 minutes and can only be used once.

### User Flow

1. User logs in to the main tivoli site with their name and access key
2. Tivoli redirects the user to the attraction with an `identity_token` in the URL
3. The attraction reads and removes the token from the URL
4. _(Optional)_ `GET /identity-tokens/{token}` — fetch user details to greet the player. Does not consume the token
5. User pays the entrance fee: `POST /transactions` with `{ identity_token, amount, api_key }` — token is consumed and a stamp is returned
6. The haunted house experience runs
7. On completion the user receives their stamp

### API Endpoints

| Method | Endpoint                    | Body                                  | Notes                            |
| ------ | --------------------------- | ------------------------------------- | -------------------------------- |
| `GET`  | `/identity-tokens/{token}`  | —                                     | Optional, does not consume token |
| `POST` | `/transactions`             | `{ identity_token, amount, api_key }` | Consumes token, returns stamp    |
| `POST` | `/transactions/{id}/payout` | `{ amount }`                          | For games with winnings          |

### Error Handling

On `401` (expired or already used token) the user is shown a clear error message with a link back to the main tivoli site.

## Group

Built by [Marie Färnström], [Patricia Loayza Frykberg] and [Malin Persson] as part of the Yrgo WU25 Tivoli project.
