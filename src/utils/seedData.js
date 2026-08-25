/**
 * STRICT SOURCE OF TRUTH — GAD Aesthetic Clinic official price list (updated).
 * Seeds Firestore (one click from the Admin Dashboard).
 * Categories + Treatments are overwritten with this data; Deals/Products only seed when empty.
 */

export const seedCategories = [
  { slug: 'glam-facials', name: 'Glam Facials', order: 1, image: '' },
  { slug: 'hollywood-peels', name: 'Hollywood Peels', order: 2, image: '' },
  { slug: 'laser-hair-removal', name: 'Laser Hair Removal', order: 3, image: '' },
  { slug: 'glow-peels', name: 'Glow Peels', order: 4, image: '' },
  { slug: 'eye-dark-circles', name: 'Eye Dark Circles', order: 5, image: '' },
  { slug: 'skin-brightening-drip', name: 'Skin Brightening Drip', order: 6, image: '' },
  { slug: 'prps-face', name: "PRP's Face", order: 7, image: '' },
  { slug: 'prp-hair', name: 'PRP Hair', order: 8, image: '' },
  { slug: 'hair-exosomes', name: 'Hair Exosomes', order: 9, image: '' },
  { slug: 'skin-rejuvenation', name: 'Skin Rejuvenation', order: 10, image: '' },
  { slug: 'acne-scars', name: 'Acne Scars', order: 11, image: '' },
  { slug: 'melasma', name: 'Melasma', order: 12, image: '' },
  { slug: 'tiny-fixers', name: 'Tiny Fixers', order: 13, image: '' },
  { slug: 'weight-loss', name: 'Weight Loss', order: 14, image: '' },
  { slug: 'cosmetic', name: 'Cosmetic', order: 15, image: '' },
  { slug: 'special-treatments', name: 'Special Treatments', order: 16, image: '' },
  { slug: 'additional-treatments', name: 'Additional Treatments', order: 17, image: '' },
];

const T = (categorySlug, name, duration, originalPrice, discountedPrice, description, extra = {}) => ({
  categorySlug,
  name,
  duration,
  originalPrice,
  discountedPrice,
  description,
  ...extra,
});

export const seedTreatments = [
  // 1 — Glam Facials
  T('glam-facials', 'Deep Cleansing Hydra Facial', '40–45 mins', 4500, 2000,
    'A focused HydraFacial session that purges congestion, blackheads and excess oil while restoring deep hydration. Ideal for oily and acne-prone skin seeking a fresh, clear complexion.'),
  T('glam-facials', '12-Step Hydra Facial', '45–60 mins', 7500, 3000,
    'Our signature multi-step HydraFacial deeply cleanses, exfoliates, extracts and hydrates the skin with nourishing serums. Instantly visible glow with zero downtime — perfect red-carpet prep.'),
  T('glam-facials', 'Gold Sprinkle Hydra Facial', '60 mins', 12500, 5000,
    'A luxurious HydraFacial elevated with 24K gold sprinkle infusion to brighten, firm and impart a radiant golden glow. The ultimate indulgence for special occasions.'),
  T('glam-facials', 'GAD Special Hydra Facial', '75 mins', 17500, 7000,
    'Our most comprehensive facial — advanced HydraFacial technology combined with booster serums, LED therapy and lymphatic drainage for complete skin rejuvenation.'),

  // 2 — Hollywood Peels
  T('hollywood-peels', 'Hollywood Peel Face', '45 mins', 7500, 3000,
    'The famous carbon laser peel — liquid carbon is vaporised by laser light to deeply exfoliate, unclog pores, reduce pigmentation and deliver the signature Hollywood glow.'),
  T('hollywood-peels', 'Hollywood Neck Peel', '30–45 mins', 7500, 3000,
    'Carbon laser peel tailored for the neck area — improves texture, tone and dullness for a seamlessly youthful neck.'),
  T('hollywood-peels', 'Hollywood Hands Peel', '30 mins', 7500, 3000,
    'Rejuvenate ageing hands with carbon laser technology — softens pigmentation and restores a smooth, even look.'),
  T('hollywood-peels', 'Hollywood UnderArms Peel', '30 mins', 7500, 3000,
    'Gentle carbon laser brightening for the underarm area — lightens pigmentation and smooths skin texture safely.'),
  T('hollywood-peels', 'Hollywood UnderLegs Peel', '30 mins', 7500, 3000,
    'Targeted carbon laser treatment for the inner thighs and under-leg area to reduce darkness and friction pigmentation.'),
  T('hollywood-peels', 'Hollywood Feet Peel', '30 mins', 7500, 3000,
    'Restores softness and even tone to the feet with precise carbon laser exfoliation.'),

  // 3 — Laser Hair Removal
  T('laser-hair-removal', 'Full Face Laser', '30 mins', 3000, 1500,
    'Safe, precise diode laser hair removal for the entire face — upper lip, chin, cheeks and sideburns. Progressive, lasting reduction with every session.'),
  T('laser-hair-removal', 'Body Per Part Laser', '20–40 mins', 3000, 1500,
    'Laser hair removal priced per body area — underarms, arms, legs, back and more. Smooth, stubble-free skin with lasting results.'),
  T('laser-hair-removal', 'Full Body (without face)', '90–120 mins', 13000, 6500,
    'Complete body laser hair removal covering all major areas except the face — the fastest route to permanently smooth skin.'),
  T('laser-hair-removal', 'Full Body with face', '120–150 mins', 15900, 7950,
    'The ultimate hair-free package — full body plus complete face laser coverage in one premium session.'),
  T('laser-hair-removal', 'Beard Contouring', '20–30 mins', 3000, 1500,
    'Precision laser shaping of the beard line for men — sharp, clean contours with permanent reduction of stray growth.'),
  T('laser-hair-removal', 'IPL Full Face', '30 mins', 4250, 1700,
    'Intense Pulsed Light therapy for the full face — reduces hair while improving tone and glow in the same session.'),
  T('laser-hair-removal', 'IPL Full Body (without face)', '90 mins', 20000, 8000,
    'Full-body IPL session for hair reduction and skin brightening — efficient, comfortable and effective.'),
  T('laser-hair-removal', 'Derma Planning', '30 mins', 1000, 1000,
    'Professional dermaplaning gently removes dead skin cells and fine vellus hair, revealing a smoother, brighter complexion and flawless makeup application.'),

  // 4 — Glow Peels
  T('glow-peels', 'Glow Peel', '30–40 mins', 5000, 2000,
    'A medium-depth chemical peel that dissolves dull surface cells, fades pigmentation and unveils fresh, luminous skin.'),
  T('glow-peels', 'Brightening Peel', '30–40 mins', 5000, 2000,
    'Specially formulated peel with tyrosinase inhibitors to target dark spots, melasma and uneven tone for a brighter complexion.'),
  T('glow-peels', 'Acne Peel', '30–40 mins', 5000, 2000,
    'Anti-bacterial and keratolytic peel that clears active breakouts, unclogs pores and gradually fades post-acne marks.'),

  // 5 — Eye Dark Circles
  T('eye-dark-circles', 'Eye PRP with Microneedling', '45 mins', 9870, 3950,
    'Platelet-rich plasma delivered with microneedling around the eyes — thickens delicate skin, softens dark circles and refreshes tired eyes.'),
  T('eye-dark-circles', 'Polynucleotides (Skin Booster)', '45 mins', 35000, 35000,
    'Regenerative polynucleotide injections that repair and revitalize the under-eye area at a cellular level — the latest in aesthetic science.'),

  // 6 — Skin Brightening Drip
  T('skin-brightening-drip', 'Whitening Drip (Silver)', '45–60 mins', 10000, 10000,
    'Intravenous brightening therapy with glutathione and vitamin C for a gradual, full-body radiance.'),
  T('skin-brightening-drip', 'Whitening Drip (Gold)', '45–60 mins', 12000, 12000,
    'Our premium glutathione drip protocol — higher antioxidant dosing for enhanced brightening and anti-ageing benefits.'),
  T('skin-brightening-drip', 'Whitening Drip (Diamond)', '60 mins', 15000, 15000,
    'The ultimate brightening infusion — maximum-strength glutathione blend with supportive micronutrients for visible luminosity.'),
  T('skin-brightening-drip', 'NAD Drip', '60–90 mins', 14000, 14000,
    'NAD+ infusion therapy supporting cellular repair, energy metabolism, mental clarity and youthful skin function.'),
  T('skin-brightening-drip', 'Collagen Drip', '45–60 mins', 7000, 7000,
    'IV collagen and vitamin therapy that supports skin elasticity, hydration and a plump, youthful appearance.'),

  // 7 — PRP's Face
  T('prps-face', 'Face PRP With Microneedling', '60 mins', 9870, 3950,
    'Your own platelet-rich plasma micro-needled into the skin to stimulate collagen, refine texture and restore a natural, healthy glow.'),
  T('prps-face', 'Meso Whitening Serum', '45 mins', 7500, 3000,
    'Targeted mesotherapy cocktail of whitening and antioxidant serums delivered into the skin for deep, lasting brightening.'),
  T('prps-face', 'Face PRP with Meso', '75 mins', 17370, 6950,
    'The ultimate regenerative duo — PRP combined with whitening mesotherapy for dramatic glow, texture and tone improvement.'),
  T('prps-face', 'PRGF', '45 mins', 11250, 4500,
    'Plasma Rich in Growth Factors prepared for facial regeneration — concentrated bio-active proteins that accelerate repair and radiance.'),
  T('prps-face', 'PRF', '60 mins', 11250, 4500,
    'Platelet-Rich Fibrin facial therapy — a slow-release matrix of growth factors that rejuvenates skin naturally over several weeks.'),
  T('prps-face', 'PDRN Vial', '45 mins', 12500, 5000,
    'Polydeoxyribonucleotide (salmon-DNA) therapy that repairs damaged skin, boosts elasticity and delivers a glass-skin finish.'),

  // 8 — PRP Hair
  T('prp-hair', 'Hair PRP with Microneedling', '60 mins', 9870, 3950,
    'Growth-factor rich plasma injected into thinning areas to awaken dormant follicles, reduce hair fall and boost density.'),
  T('prp-hair', 'PRGF Serum', '45 mins', 12500, 5000,
    'Plasma Rich in Growth Factors — an advanced, highly concentrated regenerative serum for superior hair restoration results.'),
  T('prp-hair', 'Hair PRF', '60 mins', 11245, 4500,
    'Platelet-Rich Fibrin therapy — a next-generation, slow-release growth factor treatment for sustained hair regrowth.'),
  T('prp-hair', 'PRGF', '45 mins', 11250, 4500,
    'Concentrated PRGF sessions for the scalp — targeted growth-factor delivery that strengthens follicles and improves hair quality.'),
  T('prp-hair', 'PRF', '60 mins', 11250, 4500,
    'PRF scalp therapy releasing growth factors gradually — ideal for maintaining density between full treatment courses.'),
  T('prp-hair', 'PDRN Vial', '45 mins', 12500, 5000,
    'PDRN regenerative therapy for the scalp — improves circulation, calms inflammation and supports healthier, stronger hair growth.'),

  // 9 — Hair Exosomes
  T('hair-exosomes', 'Hair Exosomes (American)', '60 mins', null, null,
    'Cutting-edge American exosome therapy delivering powerful regenerative signals directly to hair follicles for advanced restoration.'),
  T('hair-exosomes', 'Hair Exosomes (Korean)', '60 mins', null, null,
    'Premium Korean exosome formulation renowned for purity and potency in stimulating natural hair regrowth.'),
  T('hair-exosomes', 'Hair Exosomes (Chinese)', '60 mins', null, null,
    'High-efficacy Chinese exosome therapy — a strong regenerative option for thinning hair and early hair loss.'),

  // 10 — Skin Rejuvenation
  T('skin-rejuvenation', 'Face Exosomes (American, Korean, Chinese)', '60 mins', null, null,
    'Exosome facial regeneration — microscopic messengers that command skin cells to repair, firm and brighten from within. Available in American, Korean and Chinese variants.'),
  T('skin-rejuvenation', 'Skin Booster (American, Korean, Chinese)', '45 mins', null, null,
    'Micro-injected hyaluronic acid boosters that flood the skin with deep, lasting hydration for a dewy, glass-skin finish. Choose from American, Korean or Chinese formulations.'),

  // 11 — Acne Scars
  T('acne-scars', 'MNRF', '60–90 mins', 25000, 12500,
    'Gold-standard radio-frequency microneedling that remodels scar tissue from deep within — the most effective treatment for acne scarring.'),
  T('acne-scars', 'Scar Healer Microneedling', '60 mins', 9870, 3950,
    'Advanced microneedling protocol with scar-remodelling serums to soften and flatten scars while refining overall skin texture.'),
  T('acne-scars', 'Subcision', '45–60 mins', 25000, 10000,
    'Minor surgical technique that releases tethered depressed scars — highly effective for rolling acne scars.'),
  T('acne-scars', 'TCA Cross', '30–45 mins', 12500, 5000,
    'Precision chemical reconstruction of individual ice-pick scars using high-concentration TCA for dramatic depth improvement.'),
  T('acne-scars', 'Micro Derma Abrasion', '40 mins', 5000, 2000,
    'Controlled mechanical exfoliation that smooths superficial scars, refines pores and refreshes skin texture.'),

  // 12 — Melasma
  T('melasma', 'Face PRP', '60 mins', 9870, 3950,
    'Regenerative PRP protocol specifically designed to calm and correct stubborn melasma pigmentation naturally.'),
  T('melasma', 'Melasma Peels', '40 mins', 6000, 2400,
    'Depigmenting chemical peel sequence that gradually lifts melasma patches while brightening the overall complexion.'),
  T('melasma', 'Meso with PRP', '75 mins', 17370, 6950,
    'Combined mesotherapy and PRP protocol targeting the root causes of melasma for deeper, longer-lasting correction.'),
  T('melasma', 'Melasma Laser', '45 mins', 10000, 4000,
    'Gentle laser toning that shatters melanin clusters and suppresses excess pigment production — safe for melasma-prone skin.'),
  T('melasma', 'Pico Laser', '30–45 mins', 10000, 4000,
    'Picosecond laser technology shattering pigment and revitalising skin with virtually no downtime.'),
  T('melasma', 'Transglow Booster', '45 mins', 10000, 4000,
    'Skin booster infusion engineered for an instant, translucent transglow effect — a favourite of brides.'),

  // 13 — Tiny Fixers
  T('tiny-fixers', 'Mole Removal (Per Mole)', '20–30 mins', 5000, 2000,
    'Safe, precise radio-frequency or laser removal of moles with minimal discomfort and beautifully clean healing.'),
  T('tiny-fixers', 'Mole (Above 5)', '40–60 mins', 16300, 6500,
    'Package pricing for removal of more than five moles in a single comfortable session.'),

  // 14 — Weight Loss
  T('weight-loss', 'Detox Drips (Korean)', '45–60 mins', 11000, 11000,
    'Korean-formulated IV detox infusion supporting metabolism, liver function and natural fat processing.'),
  T('weight-loss', 'Detox Drips (Chinese)', '45–60 mins', 6000, 6000,
    'Herbal-supported IV detox therapy to refresh the body, boost energy and complement your weight journey.'),
  T('weight-loss', 'Lipo Shot', '15–20 mins', 3500, 3500,
    'Fat-metabolising lipotropic injection that accelerates the breakdown of stubborn fat deposits.', { priceUnit: 'Per ML' }),
  T('weight-loss', 'Lemon Bottle', '20–30 mins', 5000, 5000,
    'The viral lemon-bottle fat-dissolving solution — targets and melts localised fat pockets without surgery.', { priceUnit: 'Per ML' }),

  // 15 — Cosmetic
  T('cosmetic', 'BB-Glow', '60 mins', 12500, 5000,
    'Semi-permanent BB-glow micro-pigment treatment that leaves skin looking perpetually made-up — even, poreless and radiant.'),
  T('cosmetic', 'Lips Tint', '45–60 mins', 12500, 5000,
    'Semi-permanent lip tinting for a naturally rosy, well-defined pout that never smudges.'),

  // 16 — Special Treatments
  T('special-treatments', 'BioRepeel', '40–50 mins', 22375, 8950,
    'Innovative bio-stimulating peel with zero peeling downtime — revitalises, brightens and tightens in one sitting.'),
  T('special-treatments', 'Fillers', '30–45 mins', null, null,
    'Premium hyaluronic acid dermal fillers to restore volume, contour features and smooth deep lines — tailored to your facial anatomy.'),
  T('special-treatments', 'Botox', '20–30 mins', null, null,
    'Purified botulinum toxin injections that relax dynamic wrinkles — frown lines, crow’s feet and forehead lines — for a refreshed look.'),
  T('special-treatments', 'Cog Threads', '45–90 mins', null, null,
    'Absorbable cog threads that mechanically lift sagging skin while stimulating new collagen for a progressive lifting effect.'),
  T('special-treatments', 'Collagen Threads', '45–90 mins', null, null,
    'Fine collagen-stimulating threads that improve skin quality, firmness and elasticity in targeted areas.'),
  T('special-treatments', 'PDO Threads', '45–90 mins', null, null,
    'PDO thread lifting — a non-surgical lift that redefines contours and triggers long-lasting collagen production.'),

  // 17 — Additional Treatments
  T('additional-treatments', 'Birth Mark Removal', '30–60 mins', 7500, 3000,
    'Layered laser lightening of pigmented birth marks with a safe, progressive protocol.'),
  T('additional-treatments', 'Tattoo Removal', '30–60 mins', 7500, 3000,
    'Q-switched laser tattoo removal that fragments ink particles session by session until skin is clear.'),
  T('additional-treatments', 'Dark Lips Treatment', '30–45 mins', 3750, 1500,
    'Targeted brightening protocol for darkened lips restoring a healthy, natural pink tone.'),
  T('additional-treatments', 'Microneedling', '45–60 mins', 9870, 3950,
    'Classic collagen-induction microneedling to improve texture, pores, fine lines and overall skin quality.'),
];

export const seedDeals = [
  {
    id: 'd1',
    title: 'Bridal Glow Package',
    includedTreatments: ['GAD Special Hydra Facial', 'Hollywood Peel Face', 'BB-Glow', 'Whitening Drip (Silver)'],
    duration: '2 sessions · ~3 hrs',
    originalPrice: 55000,
    discountedPrice: 35000,
    description:
      'Our complete bridal transformation — signature HydraFacial, Hollywood peel, BB-Glow and a brightening drip sequenced over two visits for a flawless wedding-day radiance.',
  },
  {
    id: 'd2',
    title: 'Hair Restoration Starter',
    includedTreatments: ['Hair PRP with Microneedling', 'PRGF Serum'],
    duration: '1 session · ~90 mins',
    originalPrice: 22370,
    discountedPrice: 12000,
    description:
      'Kickstart your hair-regrowth journey with a combined PRP and PRGF session — maximum growth-factor stimulation in one visit.',
  },
  {
    id: 'd3',
    title: 'Acne Scar Rescue',
    includedTreatments: ['MNRF', 'Acne Peel'],
    duration: '1 session · ~90 mins',
    originalPrice: 30000,
    discountedPrice: 14500,
    description:
      'Deep scar remodelling with MNRF followed by a calming acne peel — the clinically proven pairing for smoother, clearer skin.',
  },
  {
    id: 'd4',
    title: 'Laser Smooth Deluxe',
    includedTreatments: ['Full Body with Face Laser', 'IPL Full Face'],
    duration: '1 session · ~3 hrs',
    originalPrice: 35900,
    discountedPrice: 20000,
    description:
      'Total hair-free confidence — full body laser including face, enhanced with a full-face IPL for tone and glow.',
  },
];

export const seedProducts = [
  {
    id: 'p1',
    name: 'GAD Gentle Foaming Cleanser',
    originalPrice: 2800,
    discountedPrice: 2200,
    description: 'Sulphate-free gel cleanser with glycerin and panthenol. Removes impurities without stripping the skin barrier.',
  },
  {
    id: 'p2',
    name: 'GAD Vitamin C 15% Serum',
    originalPrice: 4500,
    discountedPrice: 3500,
    description: 'Stabilised L-ascorbic acid serum that brightens, fades pigmentation and defends against environmental damage.',
  },
  {
    id: 'p3',
    name: 'GAD Hydra Repair Moisturizer',
    originalPrice: 3800,
    discountedPrice: 3000,
    description: 'Ceramide and hyaluronic-acid rich cream that restores hydration and locks in post-treatment results.',
  },
  {
    id: 'p4',
    name: 'GAD SPF 50 Sunscreen',
    originalPrice: 3200,
    discountedPrice: 2500,
    description: 'Broad-spectrum, invisible-finish sunscreen. The single most important step to protect your treatment results.',
  },
  {
    id: 'p5',
    name: 'GAD Hair Growth Tonic',
    originalPrice: 4800,
    discountedPrice: 3900,
    description: 'Redensyl and caffeine tonic that supports follicle health between PRP sessions.',
  },
  {
    id: 'p6',
    name: 'GAD Under-Eye Revive Cream',
    originalPrice: 3600,
    discountedPrice: 2900,
    description: 'Peptide and vitamin-K formula that softens dark circles and puffiness.',
  },
];
