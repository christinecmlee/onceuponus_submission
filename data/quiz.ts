export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: {
      romantic: number;
      detective: number;
      dreamer: number;
      rebel: number;
      architect: number;
      philosopher: number;
      observer: number;
      entertainer: number;
    };
  }[];
}

export interface LiteraryType {
  id: string;
  name: string;
  description: string;
  coreDrive: string;
  strongPairings: string[];
  fullDescription: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When you pick up a book, what draws you in first?",
    options: [
      {
        text: "The emotional connection between characters",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 1, observer: 1, entertainer: 0 }
      },
      {
        text: "A compelling mystery to solve",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 1, architect: 2, philosopher: 1, observer: 2, entertainer: 0 }
      },
      {
        text: "Beautiful, imaginative world-building",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 0, architect: 1, philosopher: 1, observer: 1, entertainer: 2 }
      },
      {
        text: "Characters who challenge the status quo",
        scores: { romantic: 1, detective: 1, dreamer: 1, rebel: 3, architect: 0, philosopher: 2, observer: 1, entertainer: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to read?",
    options: [
      {
        text: "Slowly, savoring every word and emotion",
        scores: { romantic: 2, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 3, observer: 2, entertainer: 0 }
      },
      {
        text: "Quickly, eager to solve the puzzle",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 1, architect: 2, philosopher: 0, observer: 1, entertainer: 2 }
      },
      {
        text: "Immersively, losing myself completely",
        scores: { romantic: 2, detective: 1, dreamer: 3, rebel: 1, architect: 0, philosopher: 1, observer: 1, entertainer: 2 }
      },
      {
        text: "Analytically, questioning everything",
        scores: { romantic: 0, detective: 2, dreamer: 0, rebel: 2, architect: 3, philosopher: 3, observer: 3, entertainer: 0 }
      }
    ]
  },
  {
    id: 3,
    question: "What type of ending satisfies you most?",
    options: [
      {
        text: "Love conquers all",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 0, observer: 0, entertainer: 2 }
      },
      {
        text: "Justice is served",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 2, architect: 2, philosopher: 1, observer: 1, entertainer: 0 }
      },
      {
        text: "Hope for a better world",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 2, architect: 1, philosopher: 2, observer: 1, entertainer: 1 }
      },
      {
        text: "Thought-provoking ambiguity",
        scores: { romantic: 0, detective: 1, dreamer: 1, rebel: 1, architect: 1, philosopher: 3, observer: 3, entertainer: 0 }
      }
    ]
  },
  {
    id: 4,
    question: "In a book club discussion, you're most likely to:",
    options: [
      {
        text: "Share how the story made you feel",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 1, architect: 0, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "Analyze plot structure and clues",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 0, architect: 3, philosopher: 2, observer: 2, entertainer: 0 }
      },
      {
        text: "Imagine alternative storylines",
        scores: { romantic: 1, detective: 1, dreamer: 3, rebel: 2, architect: 1, philosopher: 1, observer: 1, entertainer: 3 }
      },
      {
        text: "Question the author's choices",
        scores: { romantic: 0, detective: 1, dreamer: 0, rebel: 3, architect: 2, philosopher: 3, observer: 2, entertainer: 1 }
      }
    ]
  },
  {
    id: 5,
    question: "Which literary device appeals to you most?",
    options: [
      {
        text: "Metaphors about love and connection",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 2, observer: 1, entertainer: 1 }
      },
      {
        text: "Foreshadowing and red herrings",
        scores: { romantic: 0, detective: 3, dreamer: 1, rebel: 1, architect: 2, philosopher: 1, observer: 2, entertainer: 1 }
      },
      {
        text: "Vivid imagery and symbolism",
        scores: { romantic: 2, detective: 0, dreamer: 3, rebel: 1, architect: 1, philosopher: 2, observer: 2, entertainer: 2 }
      },
      {
        text: "Unreliable narrators",
        scores: { romantic: 0, detective: 2, dreamer: 1, rebel: 3, architect: 1, philosopher: 2, observer: 3, entertainer: 2 }
      }
    ]
  },
  {
    id: 6,
    question: "What motivates you to finish a book?",
    options: [
      {
        text: "Caring deeply about the characters",
        scores: { romantic: 3, detective: 1, dreamer: 2, rebel: 1, architect: 0, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "Needing to know 'whodunit'",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 1, architect: 2, philosopher: 0, observer: 1, entertainer: 1 }
      },
      {
        text: "Being transported to another world",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 1, architect: 0, philosopher: 1, observer: 1, entertainer: 3 }
      },
      {
        text: "Questioning everything I thought I knew",
        scores: { romantic: 0, detective: 1, dreamer: 1, rebel: 3, architect: 2, philosopher: 3, observer: 2, entertainer: 0 }
      }
    ]
  },
  {
    id: 7,
    question: "Your ideal reading environment is:",
    options: [
      {
        text: "A cozy nook with soft lighting",
        scores: { romantic: 3, detective: 1, dreamer: 2, rebel: 0, architect: 0, philosopher: 2, observer: 2, entertainer: 1 }
      },
      {
        text: "A quiet study with good focus",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 0, architect: 3, philosopher: 3, observer: 3, entertainer: 0 }
      },
      {
        text: "Anywhere with beautiful views",
        scores: { romantic: 2, detective: 0, dreamer: 3, rebel: 1, architect: 1, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "A bustling café with energy",
        scores: { romantic: 1, detective: 1, dreamer: 1, rebel: 3, architect: 1, philosopher: 0, observer: 2, entertainer: 3 }
      }
    ]
  },
  {
    id: 8,
    question: "When recommending books, you focus on:",
    options: [
      {
        text: "The emotional journey",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 1, architect: 0, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "The ingenious plot twists",
        scores: { romantic: 0, detective: 3, dreamer: 1, rebel: 1, architect: 2, philosopher: 1, observer: 1, entertainer: 2 }
      },
      {
        text: "The beautiful writing style",
        scores: { romantic: 2, detective: 0, dreamer: 3, rebel: 0, architect: 1, philosopher: 2, observer: 2, entertainer: 1 }
      },
      {
        text: "The important themes",
        scores: { romantic: 1, detective: 1, dreamer: 1, rebel: 3, architect: 2, philosopher: 3, observer: 2, entertainer: 0 }
      }
    ]
  },
  {
    id: 9,
    question: "You're drawn to characters who are:",
    options: [
      {
        text: "Passionate and emotionally complex",
        scores: { romantic: 3, detective: 1, dreamer: 2, rebel: 2, architect: 0, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "Clever and methodical",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 0, architect: 3, philosopher: 2, observer: 2, entertainer: 0 }
      },
      {
        text: "Imaginative and visionary",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 2, architect: 1, philosopher: 2, observer: 1, entertainer: 2 }
      },
      {
        text: "Independent and unconventional",
        scores: { romantic: 1, detective: 1, dreamer: 2, rebel: 3, architect: 1, philosopher: 2, observer: 2, entertainer: 2 }
      }
    ]
  },
  {
    id: 10,
    question: "What type of conflict interests you most?",
    options: [
      {
        text: "Matters of the heart",
        scores: { romantic: 3, detective: 0, dreamer: 1, rebel: 1, architect: 0, philosopher: 1, observer: 1, entertainer: 2 }
      },
      {
        text: "Puzzles and mysteries",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 0, architect: 2, philosopher: 1, observer: 2, entertainer: 1 }
      },
      {
        text: "Good versus evil",
        scores: { romantic: 1, detective: 1, dreamer: 3, rebel: 2, architect: 1, philosopher: 1, observer: 1, entertainer: 2 }
      },
      {
        text: "Individual versus society",
        scores: { romantic: 1, detective: 1, dreamer: 1, rebel: 3, architect: 2, philosopher: 3, observer: 3, entertainer: 0 }
      }
    ]
  },
  {
    id: 11,
    question: "Your approach to spoilers is:",
    options: [
      {
        text: "I avoid them completely - the journey matters most",
        scores: { romantic: 2, detective: 1, dreamer: 3, rebel: 1, architect: 1, philosopher: 2, observer: 2, entertainer: 2 }
      },
      {
        text: "I don't mind them - I focus on how things happen",
        scores: { romantic: 1, detective: 3, dreamer: 0, rebel: 1, architect: 3, philosopher: 3, observer: 3, entertainer: 1 }
      },
      {
        text: "Sometimes I seek them out to prepare emotionally",
        scores: { romantic: 3, detective: 0, dreamer: 1, rebel: 0, architect: 0, philosopher: 1, observer: 2, entertainer: 0 }
      },
      {
        text: "I use them to decide if a book challenges conventions",
        scores: { romantic: 0, detective: 2, dreamer: 1, rebel: 3, architect: 2, philosopher: 2, observer: 2, entertainer: 1 }
      }
    ]
  },
  {
    id: 12,
    question: "When you disagree with a book's message, you:",
    options: [
      {
        text: "Focus on the emotional truth within the story",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 1, observer: 2, entertainer: 1 }
      },
      {
        text: "Analyze the logic and evidence presented",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 1, architect: 3, philosopher: 2, observer: 3, entertainer: 0 }
      },
      {
        text: "Appreciate the alternative perspective",
        scores: { romantic: 1, detective: 1, dreamer: 3, rebel: 1, architect: 1, philosopher: 3, observer: 3, entertainer: 2 }
      },
      {
        text: "Use it as a starting point for debate",
        scores: { romantic: 0, detective: 1, dreamer: 0, rebel: 3, architect: 2, philosopher: 2, observer: 1, entertainer: 2 }
      }
    ]
  },
  {
    id: 13,
    question: "Your favorite part of storytelling is:",
    options: [
      {
        text: "The moments that make you feel deeply",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 1, architect: 0, philosopher: 1, observer: 2, entertainer: 2 }
      },
      {
        text: "The carefully constructed plot revelations",
        scores: { romantic: 0, detective: 3, dreamer: 0, rebel: 0, architect: 3, philosopher: 1, observer: 2, entertainer: 1 }
      },
      {
        text: "The creation of entire worlds",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 1, architect: 2, philosopher: 1, observer: 1, entertainer: 3 }
      },
      {
        text: "The exploration of big ideas",
        scores: { romantic: 0, detective: 1, dreamer: 1, rebel: 3, architect: 2, philosopher: 3, observer: 2, entertainer: 0 }
      }
    ]
  },
  {
    id: 14,
    question: "You'd rather read a book that:",
    options: [
      {
        text: "Makes you believe in love again",
        scores: { romantic: 3, detective: 0, dreamer: 2, rebel: 0, architect: 0, philosopher: 0, observer: 1, entertainer: 2 }
      },
      {
        text: "Keeps you guessing until the very end",
        scores: { romantic: 0, detective: 3, dreamer: 1, rebel: 1, architect: 2, philosopher: 0, observer: 1, entertainer: 2 }
      },
      {
        text: "Transports you to magical places",
        scores: { romantic: 1, detective: 0, dreamer: 3, rebel: 1, architect: 0, philosopher: 1, observer: 1, entertainer: 3 }
      },
      {
        text: "Changes how you see the world",
        scores: { romantic: 1, detective: 1, dreamer: 2, rebel: 3, architect: 2, philosopher: 3, observer: 3, entertainer: 0 }
      }
    ]
  }
];

export const LITERARY_TYPES: Record<string, LiteraryType> = {
  romantic: {
    id: 'romantic',
    name: 'The Romantic',
    description: 'You believe in the transformative power of love and human connection.',
    coreDrive: 'Seeking deep emotional resonance and authentic relationships',
    strongPairings: ['The Dreamer', 'The Observer', 'The Entertainer'],
    fullDescription: 'You are drawn to stories that explore the depths of human emotion and connection. Love, in all its forms, captivates you - not just romantic love, but the love between friends, family, and even the love of ideals. You believe that relationships have the power to transform us, and you seek stories that honor this truth.'
  },
  detective: {
    id: 'detective',
    name: 'The Detective',
    description: 'You thrive on puzzles, mysteries, and the satisfaction of solving complex problems.',
    coreDrive: 'Uncovering truth through logic and careful observation',
    strongPairings: ['The Architect', 'The Observer', 'The Philosopher'],
    fullDescription: 'Your mind is naturally analytical, always seeking patterns and connections others might miss. You love the intellectual challenge of a well-constructed mystery and the satisfaction of piecing together clues. For you, reading is an active process of deduction and discovery.'
  },
  dreamer: {
    id: 'dreamer',
    name: 'The Dreamer',
    description: 'You are captivated by imagination, beauty, and the infinite possibilities of storytelling.',
    coreDrive: 'Exploring boundless imagination and creative expression',
    strongPairings: ['The Romantic', 'The Entertainer', 'The Philosopher'],
    fullDescription: 'You possess a vivid imagination and are drawn to stories that expand the boundaries of what\'s possible. Whether it\'s fantasy worlds, lyrical prose, or innovative storytelling techniques, you appreciate the artistry and creativity that goes into crafting something truly original.'
  },
  rebel: {
    id: 'rebel',
    name: 'The Rebel',
    description: 'You question authority, challenge conventions, and champion the underdog.',
    coreDrive: 'Challenging systems and fighting for justice and change',
    strongPairings: ['The Philosopher', 'The Observer', 'The Architect'],
    fullDescription: 'You have a natural resistance to conformity and are drawn to stories that question the status quo. You appreciate characters who stand up for what\'s right, even when it\'s difficult, and narratives that explore themes of social justice, rebellion, and transformation.'
  },
  architect: {
    id: 'architect',
    name: 'The Architect',
    description: 'You appreciate structure, craftsmanship, and the meticulous construction of narrative.',
    coreDrive: 'Understanding how things work and appreciating masterful construction',
    strongPairings: ['The Detective', 'The Philosopher', 'The Observer'],
    fullDescription: 'You have a deep appreciation for the craft of storytelling itself. You notice how authors build their narratives, develop their themes, and construct their prose. You\'re drawn to works that demonstrate exceptional skill in their execution and appreciate the architecture behind great literature.'
  },
  philosopher: {
    id: 'philosopher',
    name: 'The Philosopher',
    description: 'You seek wisdom, explore big questions, and ponder the meaning of existence.',
    coreDrive: 'Exploring fundamental questions about life, meaning, and human nature',
    strongPairings: ['The Observer', 'The Architect', 'The Rebel'],
    fullDescription: 'You are drawn to literature that grapples with the big questions of human existence. You enjoy books that make you think deeply about morality, meaning, and the human condition. You\'re not afraid of complex, challenging works that require reflection and contemplation.'
  },
  observer: {
    id: 'observer',
    name: 'The Observer',
    description: 'You notice subtleties, appreciate nuance, and excel at reading between the lines.',
    coreDrive: 'Understanding the subtle complexities of human nature and society',
    strongPairings: ['The Detective', 'The Philosopher', 'The Romantic'],
    fullDescription: 'You possess a keen eye for detail and subtext. You excel at picking up on the subtle cues that reveal character motivation and thematic depth. You appreciate authors who trust their readers to infer meaning and enjoy the process of discovering layers within a narrative.'
  },
  entertainer: {
    id: 'entertainer',
    name: 'The Entertainer',
    description: 'You read for joy, escapism, and the pure pleasure of a well-told story.',
    coreDrive: 'Finding joy, humor, and delightful escape in storytelling',
    strongPairings: ['The Dreamer', 'The Romantic', 'The Detective'],
    fullDescription: 'You believe that one of literature\'s greatest gifts is its ability to entertain and bring joy. You\'re drawn to stories that make you laugh, gasp, or lose track of time. You appreciate authors who can spin a compelling yarn and create characters you genuinely enjoy spending time with.'
  }
};