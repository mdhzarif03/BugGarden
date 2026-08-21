export interface UserProfile {
  name: string;
  avatar: string;
  xp: number;
  completedIds: string[];
}

const STORAGE_KEY = "buggarden_user_profile";

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return { name: "Guest Developer", avatar: "⚡", xp: 0, completedIds: [] };
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { name: "Guest Developer", avatar: "⚡", xp: 0, completedIds: [] };
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function markChallengeComplete(id: string, xpReward: number = 50) {
  const profile = getUserProfile();
  if (!profile.completedIds.includes(id)) {
    profile.completedIds.push(id);
    profile.xp += xpReward;
    saveUserProfile(profile);
  }
  return profile;
}
