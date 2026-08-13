/**
 * Rank tiers are driven by lifetime deposited chips (backend field `totalChipsDeposited`),
 * using the app's fixed 1000 chips = $1 USD rate. Keep these thresholds in sync with
 * UsersService.RANK_THRESHOLDS in the backend.
 */
export const RANK_ORDER = ["bronze", "silver", "gold", "platinum", "diamond"];

export const RANK_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000,
  diamond: 50000,
};

export const RANK_META = {
  bronze: {
    label: "Bronce",
    icon: "military_tech",
    className: "from-[#8c5a3c] to-[#5a3620] text-[#f0d9c4]",
  },
  silver: {
    label: "Plata",
    icon: "military_tech",
    className: "from-[#c9c9d1] to-[#8a8a94] text-[#1a1a1f]",
  },
  gold: {
    label: "Oro",
    icon: "workspace_premium",
    className: "from-[#f5d980] to-[#c9a84c] text-[#1a1a1f]",
  },
  platinum: {
    label: "Platino",
    icon: "diamond",
    className: "from-[#d8f0f5] to-[#8fc9d6] text-[#1a1a1f]",
  },
  diamond: {
    label: "Diamante",
    icon: "auto_awesome",
    className: "from-[#9ad8ff] to-[#3f6fd6] text-white",
  },
};

export const getRankMeta = (tier) => RANK_META[tier] || RANK_META.bronze;

/**
 * Returns { label, threshold } for the tier above `tier`, or null if already at the top.
 */
export const getNextRank = (tier) => {
  const index = RANK_ORDER.indexOf(tier);
  if (index === -1 || index === RANK_ORDER.length - 1) {
    return null;
  }
  const nextTier = RANK_ORDER[index + 1];
  return { tier: nextTier, ...RANK_META[nextTier], threshold: RANK_THRESHOLDS[nextTier] };
};
