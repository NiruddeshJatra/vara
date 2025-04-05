/**
 * Product attribute constants for the frontend
 * These align with the backend CONDITION_CHOICES and OWNERSHIP_HISTORY_CHOICES
 */

export const OwnershipHistory = {
  FIRSTHAND: "firsthand",
  SECONDHAND: "secondhand"
} as const;

export const OWNERSHIP_HISTORY_VALUES = Object.values(OwnershipHistory);

export const OWNERSHIP_HISTORY_DISPLAY: Record<string, string> = {
  [OwnershipHistory.FIRSTHAND]: "First Hand",
  [OwnershipHistory.SECONDHAND]: "Second Hand"
};

export const OWNERSHIP_HISTORY_DESCRIPTIONS: Record<string, string> = {
  [OwnershipHistory.FIRSTHAND]: "I am the original owner of this item",
  [OwnershipHistory.SECONDHAND]: "I purchased this item from someone else"
};
