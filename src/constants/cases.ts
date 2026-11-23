import type { CaseStudy } from '../types/cases';

export const CASE_INTERVAL_MS = 6500;
export const caseStudies: CaseStudy[] = [
  {
    id: 'product',
    title: 'An idea people can use.',
    category: 'Product design & development',
    theme: 'product',
    phases: [
      {
        label: 'The challenge',
        heading: 'Start with the right question.',
        description:
          'Space for the client’s idea, who it helps, and what we set out to solve.',
        visualLabel: 'A rough idea becomes a clear direction',
      },
      {
        label: 'The outcome',
        heading: 'Show what changed.',
        description:
          'Space for the product we delivered and the difference it made to real users.',
        visualLabel: 'A clear direction becomes a working product',
      },
      {
        label: 'What we learned',
        heading: 'Keep the useful part.',
        description:
          'Space for what testing taught us and what we would improve next.',
        visualLabel: 'Feedback shapes the next version',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Less busywork. More progress.',
    category: 'Business tools & connected workflows',
    theme: 'operations',
    phases: [
      {
        label: 'The challenge',
        heading: 'Find the daily friction.',
        description:
          'Space for the repeated task, disconnected information, or process slowing a team down.',
        visualLabel: 'Scattered tasks need a shared path',
      },
      {
        label: 'The outcome',
        heading: 'Give time back to the team.',
        description:
          'Space for the improved workflow and verified changes in time, effort, or errors.',
        visualLabel: 'One connected workflow moves work forward',
      },
      {
        label: 'What we learned',
        heading: 'Build around real habits.',
        description:
          'Space for what the team’s day-to-day use revealed and how we adapted.',
        visualLabel: 'A human checkpoint keeps the workflow useful',
      },
    ],
  },
  {
    id: 'experience',
    title: 'A clearer way to connect.',
    category: 'Websites & digital experiences',
    theme: 'experience',
    phases: [
      {
        label: 'The challenge',
        heading: 'Make the message easy to find.',
        description:
          'Space for the audience, the business, and what visitors needed to understand.',
        visualLabel: 'Bring a scattered message into focus',
      },
      {
        label: 'The outcome',
        heading: 'Make the next step feel natural.',
        description:
          'Space for the new experience and evidence of how it helped the business.',
        visualLabel: 'A clear story leads to a useful next step',
      },
      {
        label: 'What we learned',
        heading: 'Clarity is an ongoing practice.',
        description:
          'Space for what visitors taught us and the improvements that followed.',
        visualLabel: 'Listen, refine, and make it clearer',
      },
    ],
  },
];
