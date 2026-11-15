import type { Service } from '../types/services';

export const services: Service[] = [
  {
    id: 'website',
    whole: {
      meta: 'Complete project',
      title: 'Website',
      description:
        'Create a place online where people can discover your business, understand what you offer, and take the next step.',
      examples:
        'Great for showcasing products, services, portfolios, online stores and business information.',
    },
    part: null,
  },
  {
    id: 'web-app',
    whole: {
      meta: 'Complete project',
      title: 'Web App',
      description:
        'Turn your idea into an online tool people can use directly in their browser to complete tasks, manage information or access your service.',
      examples:
        'Great for booking systems, customer portals, dashboards, memberships and custom business tools.',
    },
    part: {
      meta: 'Focused support',
      title: 'UX/UI Design',
      description:
        'We can help visualise your idea, shape the user journey and turn it into a clear, thoughtful interface.',
      examples:
        'Great for user flows, wireframes, prototypes, interface design and working alongside your existing development team.',
    },
  },
  {
    id: 'mobile',
    whole: {
      meta: 'Complete project',
      title: 'Mobile App',
      description:
        "Bring your product or service to people's phones with an app they can download from the App Store or Google Play.",
      examples:
        'Great for services people use regularly, personalised experiences, notifications and mobile-first products.',
    },
    part: {
      meta: 'Focused support',
      title: 'Development',
      description:
        'We can turn it into a fully working website or app, following your design and bringing the experience to life.',
      examples:
        'Great for frontend and backend development, CMS implementation, custom integrations and building from existing designs or prototypes.',
    },
  },
  {
    id: 'ai',
    whole: null,
    part: {
      meta: 'Focused support',
      title: 'AI Workflow',
      description:
        'Turn repetitive tasks into smarter workflows with AI, so your team can spend more time on what matters while making everyday processes more efficient.',
      examples:
        'Great for enquiries, content creation, data handling, internal processes and connecting the tools your business already uses.',
    },
  },
  {
    id: 'redesign',
    whole: {
      meta: 'Complete project',
      title: 'Redesign & Rebuild',
      description:
        'Give your existing website or app a fresh start by improving how it looks, works and supports your business.',
      examples:
        'Great for outdated websites or apps, confusing user experiences, performance improvements and complete rebuilds.',
    },
    part: {
      meta: 'Focused support',
      title: 'Testing, Launch & Support',
      description:
        'Make sure your product works as expected, get it ready to go live and keep things running smoothly after launch.',
      examples:
        'Great for quality assurance, device testing, bug fixing, deployment, ongoing maintenance and post-launch support.',
    },
  },
];
