//Room config (order, names, routes)
import { RoomId } from "@/store/useGameStore";

type RoomHelp = {
  title: string;
  description: string;
  interactions: string[];
  goal: string;
};

export const ROOM_HELP: Record<RoomId, RoomHelp> = {
  graveyard: {
    title: "The Graveyard",
    description: "The dead don't always stay buried here.",
    interactions: [
      "Look for a way through the gate",
      "Something may be watching from the shadows",
    ],
    goal: "Find the key to make your way inside.",
  },
  dolls: {
    title: "The Doll Room",
    description: "Something is rocking in the corner. It wants your attention.",
    interactions: [
      "Click on the doll to make it speak",
      "Listen carefully — or you might miss something important.",
    ],
    goal: "Interact with the doll to find the way forward.",
  },
  spiders: {
    title: "The Spider Room",
    description: "The webs are everywhere. Something is hiding behind them.",
    interactions: [
      "Click on the spider webs to remove them. But beware — you are not alone...",
    ],
    goal: "Clear all the webs, collect the key and unlock the door.",
  },
  clown: {
    title: "The Clown Room",
    description: "He sees you. And he is getting closer.",
    interactions: [
      "Keep your eyes on the clown",
      "Click to keep him at a distance",
    ],
    goal: "Survive long enough to find the way out.",
  },
};
