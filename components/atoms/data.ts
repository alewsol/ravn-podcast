export const atoms = {
  title: "ATOMS.",
  eyebrow: "A BUDERA ORIGINAL PODCAST",
  subtitle: "Meet the people making robots real.",
  introduction: {
    lead: "Turns out, some people looked at how difficult building software was and thought,",
    aside: "you know what would make this more fun? Physics.",
    body: "ATOMS is the podcast where we hang out with the brilliant, slightly insane people bringing physical AI to life. The big breakthroughs, the spectacular failures, and the crazy ideas that might just change everything.",
    cta: "Explore the podcast",
  },
  conversations: {
    eyebrow: "THE CONVERSATIONS",
    title: "Big ideas. Expensive mistakes. Really cool robots.",
    questions: [
      {
        title: "WHAT ARE YOU BUILDING?",
        body: "Robot chefs? Humanoids? Machines that can do backflips but still struggle with a doorknob? We have questions. You probably do too.",
      },
      {
        title: "WHY THE HELL ARE YOU BUILDING IT?",
        body: "Nobody accidentally gets into robotics. There's always a story, and it's usually a lot more interesting than the company bio.",
      },
      {
        title: "WHAT DO YOU KNOW THAT WE DON'T?",
        body: "The crazy bets, unpopular opinions, and things about the future that sound ridiculous until they happen. You get to hear them before everyone claims they knew all along.",
      },
    ],
  },
  episodes: {
    eyebrow: "THE PODCAST EPISODES",
    title: "Meet the brains behind the bots.",
    paragraphs: [
      "From the biggest names in robotics to the people you'll be hearing about five years from now.",
      "Come for the cool robots. Stay for the people who somehow figured out how to build them.",
    ],
    cta: "Explore the episodes",
    href: "#",
  },
  guests: {
    eyebrow: "YOUR TURN",
    title: "Got a robot story? We're all ears.",
    paragraphs: [
      "Building your first prototype? Running a fleet of thousands? Know someone doing something ridiculously interesting in physical AI?",
      "We'd love to have you on. Or hear who you think we should talk to next.",
    ],
    bonus: "Bonus points if you've ever spent a week fixing something a toddler could do.",
    appear: {
      label: "Be a guest on ATOMS",
      href: `mailto:budera.founders@gmail.com?subject=${encodeURIComponent("I'd like to come on ATOMS")}`,
    },
    suggest: {
      label: "Suggest a Guest",
      href: `mailto:budera.founders@gmail.com?subject=${encodeURIComponent("ATOMS guest suggestion")}`,
    },
  },
  tagline: "The people building the physical future.",
} as const
