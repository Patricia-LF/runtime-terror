import { RoomId } from "@/store/useGameStore";

export type SoundId =
  | "howling-wind"
  | "creaks"
  | "synth-ambience"
  | "approaching-ghost"
  | "ghostly-effect"
  | "danger"
  | "creaking-gate"
  | "creaking-door"
  | "jumpscare"
  | "jumpscare-piano"
  | "loud-jumpscare"
  | "music-box"
  | "doll-laugh"
  | "dolltalk-play"
  | "dolltalk-waiting"
  | "dolltalk-alone"
  | "key-appearing"
  | "clown-laugh"
  | "start-screen-ambience"
  | "end-screen-ambience"
  | "thunder"
  | "loud-thunder"
  ;

export type SoundKind = "ambient" | "effect";

export type SoundConfig = {
  kind: SoundKind;
  src: string[];
  loop?: boolean;
  volume?: number;
  autoplay?: boolean;
};

// Here we define which ambient sound should play in each room, using the SoundIds from our SOUND_MAP
export const ROOM_AMBIENT: Record<RoomId, SoundId> = {
  graveyard: "howling-wind",
  dolls: "creaks",
  spiders: "howling-wind",
  clown: "synth-ambience",
};

export const SOUND_MAP = {
  "howling-wind": {
    kind: "ambient",
    src: ["/assets/audio/ambient/howlingWind.mp3"],
    loop: true,
    volume: 0.5,
    autoplay: true,
  },
  creaks: {
    kind: "ambient",
    src: ["/assets/audio/ambient/creaks.mp3"],
    loop: true,
    volume: 0.5,
    autoplay: true,
  },
  "synth-ambience": {
    kind: "ambient",
    src: ["/assets/audio/ambient/synthAmbiance.mp3"],
    loop: true,
    volume: 0.5,
    autoplay: true,
  },
  "approaching-ghost": {
    kind: "effect",
    src: ["/assets/audio/effect/approachingGhost.ogg"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "ghostly-effect": {
    kind: "effect",
    src: ["/assets/audio/effect/ghostEffect.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  danger: {
    kind: "effect",
    src: ["/assets/audio/effect/dangerEffect.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: true,
  },
  "creaking-gate": {
    kind: "effect",
    src: ["/assets/audio/effect/gateCreaking.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "creaking-door": {
    kind: "effect",
    src: ["/assets/audio/effect/dooropen-creaks.wav"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  jumpscare: {
    kind: "effect",
    src: ["/assets/audio/effect/jumpscare.mp3"],
    loop: false,
    volume: 0.7,
    autoplay: false,
  },
  "jumpscare-piano": {
    kind: "effect",
    src: ["/assets/audio/effect/jumpscarePiano.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "loud-jumpscare": {
    kind: "effect",
    src: ["/assets/audio/effect/loud-jumpscare.mp3"],
    loop: false,
    volume: 0.4,
    autoplay: false,
  },
  "music-box": {
    kind: "ambient",
    src: ["/assets/audio/effect/music-box.wav"],
    loop: true,
    volume: 0.5,
    autoplay: false, // Handled manually in RockingChair
  },
  "doll-laugh": {
    kind: "effect",
    src: ["/assets/audio/effect/creepy-girl-laugh.wav"],
    loop: false,
    volume: 0.7,
    autoplay: false,
  },
  "dolltalk-play": {
    kind: "effect",
    src: ["/assets/audio/effect/dolltalk-play.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "dolltalk-waiting": {
    kind: "effect",
    src: ["/assets/audio/effect/dolltalk-waiting.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "dolltalk-alone": {
    kind: "effect",
    src: ["/assets/audio/effect/dolltalk-alone.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "key-appearing": {
    kind: "effect",
    src: ["/assets/audio/effect/key-glitter.flac"],
    loop: false,
    volume: 0.1,
    autoplay: false,
  },
  "clown-laugh": {
    kind: "effect",
    src: ["/assets/audio/effect/clown-laugh.wav"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "start-screen-ambience": {
    kind: "ambient",
    src: ["/assets/audio/ambient/startPageAmbient.mp3"],
    loop: true,
    volume: 0.5,
    autoplay: true,
  },
  "end-screen-ambience": {
    kind: "ambient",
    src: ["/assets/audio/ambient/endPageAmbient.mp3"],
    loop: true,
    volume: 0.5,
    autoplay: true,
  },
  "thunder": {
    kind: "effect",
    src: ["/assets/audio/effect/thunder.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
  "loud-thunder": {
    kind: "effect",
    src: ["/assets/audio/effect/loudThunder.mp3"],
    loop: false,
    volume: 0.5,
    autoplay: false,
  },
} as const satisfies Record<SoundId, SoundConfig>;

export type EffectSoundId = {
  [K in keyof typeof SOUND_MAP]: (typeof SOUND_MAP)[K]["kind"] extends "effect"
    ? K
    : never;
}[keyof typeof SOUND_MAP];
