/**
 * Everything personal about the site lives here. Edit freely.
 */

export interface Project {
  name: string;
  description: string;
  tags: string[];
  href?: string;
}

export const site = {
  name: "Junior Sanchez",
  firstName: "Junior",
  monogram: "J·S",
  handle: "junior",
  description:
    "A personal almanac about programming, tennis, Muay Thai, and the Catholic faith.",

  intro:
    "This is my corner of the internet: a notebook for the four things I keep coming back to. I write software, I play tennis, I train Muay Thai, and I'm Catholic. On paper they don't have much in common. In practice, they keep teaching me the same lesson.",

  /** The hero finishes the sentence "I …" with each of these in turn. */
  typer: [
    "write code that (mostly) works.",
    "chase down drop shots.",
    "throw elbows — on the pads.",
    "pray the Rosary.",
    "keep showing up.",
  ],

  links: {
    github: "https://github.com/",
    email: "hello@example.com",
  },

  projects: [
    {
      name: "This website",
      description:
        "A personal almanac built with Next.js, React and TypeScript. Its accent color follows the Church's liturgical calendar.",
      tags: ["Next.js", "TypeScript", "CSS"],
    },
    {
      name: "Your next project",
      description: "A short line about what it does and why you built it.",
      tags: ["tag", "tag"],
    },
    {
      name: "Something you're tinkering with",
      description: "Half-finished counts. Workbenches are supposed to be messy.",
      tags: ["wip"],
    },
  ] as Project[],
};
