export const navItems = [
  { href: "/atoms", id: "podcast", label: "ATOMS" },
  { href: "/founder-files", id: "editorial", label: "Founder Files" },
  { href: "/worth-watching", id: "companies", label: "Worth Watching" },
  { href: "/hot-takes", id: "opinions", label: "Hot Takes" },
] as const

export const sectionIds = ["podcast", "editorial", "companies", "opinions"] as const


export const hero = {

  brand: "BUDERA",
  title: "The media for people building the future before it’s obvious.",
  about: [
    "Here’s the truth: we’re fucking tired of TechCrunch.",
    "We’re sick and tired of founders being turned into polished little success stories. Tired of investor-led media deciding who matters. Tired of the same recycled questions, carefully rehearsed answers, funding-round porn, and whatever founder trend the internet has decided is hot this week.",
    "Budera is founder-led media for the next generation of entrepreneurs. We’re founders too, building our own companies and too busy to give a shit about the niceties. No PR scripts. No guru worship. No polished bullshit.",
    "And if you’re just larping as a founder with no fucking idea where you’re going, this isn’t for you. We don’t care whether you raised $7mn or $700 gazillion. Know where you’re going. Know why. Build something worth a damn.",
    "That’s who we’re here for.",
  ],
} as const

export const podcast = {
  label: "THE FLAGSHIP PODCAST",
  name: "ATOMS",
  title: "The people building the physical future.",
  subtitle: "This is where we talk to the slightly insane people who decided building software wasn't hard enough.",
  body: "ATOMS is our robotics and physical AI podcast. We talk to the people building the next big thing in robotics ... before the headlines, before the hype, and before everyone suddenly claims they saw it coming.",
  closing: [
    "The crazy bets, the spectacular failures, and the things they're seeing that the rest of us aren't.",
    "No PR scripts. No sci-fi bullshit. Just the people making it happen.",
  ],
  cta: {
    label: "Check it out",
    href: "/atoms",
  },
} as const

export const editorial = {
  eyebrow: "THE  EDITORIAL",
  title: "Founder Files",
  description: [
    "This is where we feature CEOs and Founders (the crazy one’s)",
    "Not the LinkedIn version.",
    "What they believe. What they’re wrong about. What they’re obsessed with. What they’d never put in a pitch deck.",
  ],
} as const

export const companies = {
  eyebrow: "THE COMPANIES",
  title: "Worth Watching",
  description: [
    "Companies before they become obvious.",
    "Interesting founders. Strange ideas. New categories. Companies we think deserve your attention before everyone else starts writing about them.",
  ],
} as const

export const opinions = {
  eyebrow: "THE OPINIONS",
  title: "Hot Takes",
  description: [
    "Strong opinions. Zero diplomatic language.",
    "Founder takes on AI, markets, fundraising, hiring, building, competition and whatever everyone is currently getting wrong.",
  ],
} as const
