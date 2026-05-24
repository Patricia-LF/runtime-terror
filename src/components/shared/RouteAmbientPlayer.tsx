"use client";
import { useAmbientController } from "@/hooks/useAmbientController";
import { useAudioUnlock } from "@/hooks/useAudioUnlock";

export default function RouteAmbientPlayer() {
  useAudioUnlock();
  useAmbientController();
  return null;
}