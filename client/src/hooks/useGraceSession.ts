import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const SESSION_KEY = "maven-grace-session-id";
const PROFILE_KEY = "maven-grace-profile-id";

export function useGraceSession() {
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const newId = nanoid();
    localStorage.setItem(SESSION_KEY, newId);
    return newId;
  });

  const [profileId, setProfileId] = useState<number | null>(() => {
    const existing = localStorage.getItem(PROFILE_KEY);
    return existing ? parseInt(existing, 10) : null;
  });

  const saveProfileId = (id: number) => {
    localStorage.setItem(PROFILE_KEY, id.toString());
    setProfileId(id);
  };

  return { sessionId, profileId, saveProfileId };
}
