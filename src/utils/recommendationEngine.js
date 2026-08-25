/**
 * Frontend matching engine for the AI Treatment Recommender.
 * Scores every active treatment against the user's answers and returns
 * the best match plus two alternatives.
 */

const CONCERN_KEYWORDS = {
  'Acne & Breakouts': ['acne', 'glow peel', 'hydra', 'microneedling', 'peel'],
  'Acne Scars': ['acne scars', 'mnrf', 'micro derma', 'scar', 'tca', 'subcision', 'microneedling', 'derma abrasion'],
  Hyperpigmentation: ['brightening', 'glow peel', 'pico', 'transglow', 'whitening', 'meso'],
  Melasma: ['melasma', 'peel', 'prp', 'meso', 'laser'],
  'Fine Lines & Wrinkles': ['prp', 'booster', 'exosome', 'biorepeel', 'collagen', 'nad'],
  'Dull Skin': ['hydra', 'glow', 'bb-glow', 'transglow', 'peel', 'drip'],
  'Uneven Skin Tone': ['brightening', 'pico', 'glow', 'whitening', 'peel'],
  'Dark Circles': ['eye', 'polynucleotide', 'prp'],
  'Hair Fall': ['hair', 'prp', 'prf', 'prgf', 'exosome'],
  'Unwanted Hair': ['laser', 'ipl', 'beard'],
  'Skin Brightening': ['whitening', 'brightening', 'glow', 'drip', 'pico', 'transglow'],
  'Large Pores': ['hydra', 'carbon', 'hollywood', 'microneedling', 'peel'],
  Other: ['hydra', 'glow', 'prp'],
};

const SKIN_TYPE_BONUS = {
  Oily: ['hydra', 'acne', 'peel', 'laser', 'ipl', 'carbon'],
  Dry: ['hydra', 'booster', 'collagen', 'drip', 'prp'],
  Combination: ['hydra', 'glow', 'peel', 'booster'],
  Sensitive: ['prp', 'booster', 'exosome', 'gentle'],
  Normal: ['glow', 'hydra', 'peel', 'drip'],
};

const GOAL_KEYWORDS = {
  'Clear Skin': ['acne', 'mnrf', 'peel', 'hydra', 'microneedling'],
  'Anti-Aging': ['prp', 'booster', 'exosome', 'nad', 'collagen', 'biorepeel', 'threads'],
  'Deep Hydration': ['hydra', 'booster', 'collagen', 'drip'],
  'Hair Restoration': ['hair', 'prp', 'prf', 'prgf', 'exosome'],
  'Skin Brightening': ['whitening', 'brightening', 'glow', 'drip', 'pico', 'bb-glow'],
  'Scar Removal': ['mnrf', 'scar', 'tca', 'subcision', 'micro derma'],
  'Smooth Hair-Free Skin': ['laser', 'ipl', 'beard'],
  'Bridal Glow': ['hydra', 'bb-glow', 'transglow', 'glow', 'whitening'],
};

function budgetMax(range) {
  if (range === 'PKR 5,000 – 15,000') return 15000;
  if (range === 'PKR 15,000 – 30,000') return 30000;
  if (range === 'PKR 30,000 – 50,000') return 50000;
  return Infinity;
}

function haystack(item) {
  return `${item.name || ''} ${item.category || ''} ${item.description || ''}`.toLowerCase();
}

export function calculateBestTreatment(user, treatments) {
  if (!treatments || treatments.length === 0) return { top: null, alternatives: [] };

  const concernKw = (CONCERN_KEYWORDS[user.primaryConcern] || CONCERN_KEYWORDS.Other).map((k) => k.toLowerCase());
  const otherKw = (user.otherConcerns || [])
    .flatMap((c) => CONCERN_KEYWORDS[c] || [])
    .map((k) => k.toLowerCase());
  const goalKw = (user.goals || [])
    .flatMap((g) => GOAL_KEYWORDS[g] || [])
    .map((k) => k.toLowerCase());
  const skinKw = (SKIN_TYPE_BONUS[user.skinType] || []).map((k) => k.toLowerCase());
  const bMax = budgetMax(user.budget);

  const scored = treatments.map((t) => {
    const hay = haystack(t);
    const price = Number(t.discountedPrice ?? t.originalPrice ?? 0);
    let score = 52;
    const reasons = [];

    if (concernKw.some((k) => hay.includes(k))) {
      score += 22;
      reasons.push(`Targets ${user.primaryConcern}`);
    } else if ((t.category || '').toLowerCase().includes((user.primaryConcern || '').toLowerCase().split(' ')[0])) {
      score += 12;
      reasons.push(`Relevant to ${user.primaryConcern}`);
    }
    if (otherKw.some((k) => hay.includes(k))) {
      score += 4;
    }
    if (skinKw.some((k) => hay.includes(k))) {
      score += 6;
      reasons.push(`Suitable for ${user.skinType.toLowerCase()} skin`);
    }
    const goalHits = goalKw.filter((k) => hay.includes(k));
    if (goalHits.length > 0) {
      score += Math.min(10, 4 + goalHits.length * 2);
      if ((user.goals || []).length) reasons.push(`Aligned with your goals`);
    }
    if (price > 0 && price <= bMax) {
      score += 8;
      reasons.push('Fits your budget');
    } else if (price > bMax) {
      score -= 14;
    }
    if (Number(t.discountedPrice) < Number(t.originalPrice)) {
      score += 2;
      reasons.push('Special discount active');
    }

    score = Math.max(40, Math.min(97, Math.round(score)));
    return { treatment: t, score, reasons: reasons.slice(0, 4) };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const topScore = top.score;
  const alternatives = scored
    .slice(1)
    .filter((s) => s.score < topScore || s.treatment.id !== top.treatment.id)
    .slice(0, 2)
    .map((s) => ({
      ...s,
      score: Math.max(58, Math.min(topScore - 4, s.score - 2 - Math.floor(Math.random() * 4))),
    }));

  return { top, alternatives };
}

export function buildProfileSummary(user) {
  const age = user.ageRange || '—';
  const gender = user.gender && user.gender !== 'Prefer not to say' ? user.gender.toLowerCase() : 'client';
  const skin = (user.skinType || '').toLowerCase();
  return `${user.fullName || 'You'} is a ${age} ${gender} with ${skin} skin, primarily concerned about ${(user.primaryConcern || 'skin health').toLowerCase()}${
    (user.otherConcerns || []).length ? ` along with ${(user.otherConcerns || []).join(', ').toLowerCase()}` : ''
  }. Based on this profile and a budget of ${user.budget || 'flexible'}, our AI engine has curated the most compatible treatments below.`;
}
