import type { LandingContent, SiteSetting } from '@/payload-types'

// Canonical content for the landing page, lifted from the approved design.
// Theme-agnostic: the same copy renders across all three visual directions.

export const siteSettingsSeed: Partial<SiteSetting> = {
  theme: 'stone',
  brandName: 'Code Box Studios',
  announcement: {
    enabled: true,
    text: 'Now booking new engagements for Q3 2026 — limited availability.',
    linkLabel: 'Get in touch',
    linkHref: '#contact',
  },
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ],
  signInLabel: 'Sign in',
  signInHref: '#',
  ctaLabel: 'Start a project',
  footer: {
    eyebrow: 'Ship faster',
    heading: 'Build with a studio that documents its work.',
    newsletterPlaceholder: 'you@company.com',
    columns: [
      {
        title: 'Studio',
        links: [
          { label: 'Services', href: '#services' },
          { label: 'Work', href: '#work' },
          { label: 'Process', href: '#process' },
          { label: 'About', href: '#about' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Contact', href: '#contact' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Careers', href: '#' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
        ],
      },
    ],
    copyright: '© 2026 Code Box Studios',
    location: 'Malta',
  },
  seo: {
    title: 'Code Box Studios — Software, built like architecture',
    description:
      'Code Box Studios designs and engineers robust, modular, and scalable web platforms — the interface layer and the systems beneath it.',
  },
}

export const landingContentSeed: Partial<LandingContent> = {
  hero: {
    eyebrow: 'Digital engineering studio · Malta',
    heading: 'Software, built like architecture.',
    body: 'Code Box Studios designs and engineers robust, modular, and scalable web platforms — the interface layer and the systems beneath it.',
    primaryCtaLabel: 'Start a project',
    secondaryCtaLabel: 'See how we work',
  },
  trust: {
    eyebrow: 'Built to sit alongside the tools your team already trusts',
    logos: [
      { name: 'Vercel' },
      { name: 'Stripe' },
      { name: 'Payload' },
      { name: 'PostgreSQL' },
      { name: 'Figma' },
    ],
  },
  services: {
    eyebrow: 'What we do',
    heading: 'Four disciplines, one system.',
    intro:
      'We take products from interface to infrastructure — and leave your team able to maintain every layer.',
    items: [
      {
        title: 'Frontend Development & UI/UX',
        description:
          'Responsive, high-performance interfaces built for clarity and made to last — design systems, accessibility, and pixel-honest execution.',
      },
      {
        title: 'Complex Web Applications',
        description:
          'Scheduling systems, internal dashboards, and custom management tools. We turn tangled operations into software people trust.',
      },
      {
        title: 'Headless E-commerce & CMS',
        description:
          'Flexible content and product platforms, decoupled from the frontend — so your team ships without waiting on the stack.',
      },
      {
        title: 'Technical Consulting & Documentation',
        description:
          'Scalable project environments, standardized workflows, and documentation that keeps teams aligned as they grow.',
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    heading: 'Engineered for scale from the first commit.',
    items: [
      {
        title: 'Modular architecture',
        description: 'Composable components and services that grow without rewrites.',
        shape: 'square',
      },
      {
        title: 'Performance by default',
        description: 'Core Web Vitals, edge delivery, and lean bundles — measured, not assumed.',
        shape: 'circle',
      },
      {
        title: 'Documented & maintainable',
        description: 'Clear conventions and living docs so any engineer can pick up the work.',
        shape: 'diamond',
      },
      {
        title: 'Headless & API-first',
        description: 'Content and commerce decoupled from delivery, integrated cleanly.',
        shape: 'notched',
      },
      {
        title: 'Accessible by standard',
        description: 'WCAG-aware from design through build, not bolted on at the end.',
        shape: 'teardrop',
      },
      {
        title: 'Type-safe end to end',
        description: 'TypeScript across the stack, so refactors are safe and intent is explicit.',
        shape: 'block',
      },
    ],
  },
  process: {
    eyebrow: 'How we work',
    heading: 'A clear path from brief to launch.',
    steps: [
      { title: 'Discover', description: 'We map goals, constraints, and the systems already in play.' },
      {
        title: 'Architect',
        description: 'We design the structure: data, components, and integration points.',
      },
      { title: 'Build', description: 'We ship in modular increments you can review and use early.' },
      {
        title: 'Handoff',
        description: 'Documentation, workflows, and support so your team owns it with confidence.',
      },
    ],
  },
  portfolio: {
    eyebrow: 'Selected work',
    heading: 'Web platforms and software built by Code Box Studios.',
    allLabel: 'All work',
    items: [
      {
        tag: 'Point of sale & business monitoring',
        title: 'SentryPOS',
        note: 'A point-of-sale and business monitoring platform for Philippine stores and cafés, connecting checkout, inventory, shift management, and analytics across branches.',
      },
      {
        tag: 'Sports & venue booking',
        title: 'Pikol',
        note: 'A pickleball court discovery and booking platform for finding venues, checking availability, and reserving court time, with payments made directly to the venue.',
      },
      {
        tag: 'Photography & online booking',
        title: 'Monochrome Studio',
        note: 'A photography studio website for browsing photo-session packages, checking available slots, and booking sessions online.',
      },
      {
        tag: 'University fleet operations',
        title: 'Motorpool Management System',
        note: 'A university motorpool management system for fleet records, trip requests, vehicle care, fuel logs, spare-parts inventory, and GPS monitoring.',
      },
      {
        tag: 'Personal finance',
        title: 'Tally',
        note: 'A web and mobile app for tracking money borrowed and lent, recurring bills, installments, repayments, and outstanding balances.',
      },
    ],
  },
  engagement: {
    eyebrow: 'Engagement models',
    heading: 'Ways to work with us.',
    plans: [
      {
        name: 'Fixed Scope',
        description: 'Defined deliverables on a fixed timeline. Best for well-specified builds.',
        features: [
          { feature: 'Clear milestones' },
          { feature: 'Fixed budget' },
          { feature: 'Full handoff docs' },
        ],
        ctaLabel: 'Scope a project',
        popular: false,
      },
      {
        name: 'Retainer',
        description: 'An ongoing partnership for products that keep evolving.',
        features: [
          { feature: 'Monthly capacity' },
          { feature: 'Priority support' },
          { feature: 'Continuous improvement' },
        ],
        ctaLabel: 'Start a retainer',
        popular: true,
      },
      {
        name: 'Embedded Team',
        description: 'Dedicated engineers working inside your team and rituals.',
        features: [
          { feature: 'Senior developers' },
          { feature: 'Your tools & cadence' },
          { feature: 'Flexible ramp' },
        ],
        ctaLabel: 'Talk to us',
        popular: false,
      },
    ],
  },
  about: {
    eyebrow: 'About',
    heading: 'A small studio obsessed with the parts most people never see.',
    body: "Code Box Studios is an independent engineering studio. We build the modular systems, interfaces, and infrastructure behind modern web products — and we document them well enough that your team keeps moving after we're gone.",
    stats: [
      { label: 'Est. 2026', note: 'Independent studio' },
      { label: 'Based in Malta', note: 'Working remotely' },
      { label: 'Frontend · Fullstack', note: 'End-to-end delivery' },
      { label: 'Headless-first', note: 'CMS & commerce' },
    ],
  },
  testimonials: {
    eyebrow: 'In their words',
    items: [
      {
        quote:
          "They didn't just deliver features — they left us with a system our whole team actually understands.",
        name: 'Product Lead',
        role: 'Fintech scale-up',
      },
      {
        quote: "The clearest handoff we've ever had. Documentation that actually gets read.",
        name: 'CTO',
        role: 'D2C brand',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Questions, answered.',
    items: [
      {
        question: 'How do projects usually start?',
        answer:
          'With a short discovery call, then a written proposal covering scope, timeline, and cost.',
      },
      {
        question: 'Do you work with existing teams?',
        answer:
          'Yes. We embed alongside in-house engineers or lead delivery end-to-end — whatever fits.',
      },
      {
        question: "What's your stack?",
        answer:
          'Modern TypeScript, React and friends, headless CMS and commerce, and the right backend for the job.',
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'Yes — via retainer, or a defined support window after handoff.',
      },
      {
        question: 'Where are you based?',
        answer: 'Malta, working with clients remotely across time zones.',
      },
    ],
  },
  contact: {
    eyebrow: 'Start a project',
    heading: "Tell us what you're building.",
    body: "Share a few details and we'll get back within two business days.",
    email: 'hello@codeboxstudios.com',
    locationNote: 'Malta · Remote-friendly',
    submitLabel: 'Send inquiry',
    budgetOptions: [
      { label: 'Under €10k' },
      { label: '€10k – €25k' },
      { label: '€25k – €50k' },
      { label: '€50k – €100k' },
      { label: '€100k+' },
      { label: 'Not sure yet' },
    ],
  },
}
