export type SkillCategory = {
  category: string;
  skills: string[];
};

export type AiCapability = {
  name: string;
  description: string;
  score: number;
  icon: string;
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Data Analytics",
    skills: ["SQL", "Tableau", "Excel", "Google Sheets", "R Programming (Foundations)"],
  },
  {
    category: "Data Operations",
    skills: ["High-Accuracy Data Entry", "Relational Databases", "Digital Records Management", "40 WPM Typing"],
  },
  {
    category: "AI & Automation",
    skills: ["Prompt Engineering", "ChatGPT", "Gemini", "Workflow Automation", "Office Digitization"],
  },
  {
    category: "Office Productivity",
    skills: ["MS Word", "MS PowerPoint", "MS Excel", "PDF Conversion", "Google Workspace"],
  },
  {
    category: "Soft Skills",
    skills: ["Analytical Thinking", "Cross-Cultural Communication", "Conflict Resolution", "Adaptability", "Client Relations"],
  },
];

export const aiCapabilities: AiCapability[] = [
  {
    name: "Web App Builder",
    description: "Designing and deploying functional web applications with AI assistance.",
    score: 10,
    icon: "Globe",
  },
  {
    name: "Product Design Studio",
    description: "Crafting user-centered product designs and interactive prototypes.",
    score: 10,
    icon: "Palette",
  },
  {
    name: "Security Engineer",
    description: "Applying AI-augmented security review and vulnerability assessment practices.",
    score: 10,
    icon: "ShieldCheck",
  },
  {
    name: "Secure App Builder",
    description: "Building applications with security-first architecture and access controls.",
    score: 10,
    icon: "Lock",
  },
  {
    name: "Documents & Presentations",
    description: "Creating polished business documents and executive presentations with AI.",
    score: 9,
    icon: "FileText",
  },
  {
    name: "Data Analytics",
    description: "Leveraging AI tools for data exploration, visualization, and insight extraction.",
    score: 10,
    icon: "BarChart2",
  },
  {
    name: "Agent & MCP Builder",
    description: "Constructing autonomous AI agents and multi-context processing pipelines.",
    score: 10,
    icon: "Bot",
  },
  {
    name: "OSS Maintainer",
    description: "Contributing to and maintaining open-source software with AI-accelerated workflows.",
    score: 10,
    icon: "GitBranch",
  },
  {
    name: "QA & Test Automation",
    description: "Automating quality assurance pipelines and test suites using AI tools.",
    score: 10,
    icon: "TestTube2",
  },
  {
    name: "DevOps & Cloud",
    description: "Orchestrating cloud infrastructure and CI/CD pipelines with AI-driven ops.",
    score: 10,
    icon: "Cloud",
  },
  {
    name: "Accessibility & Inclusive UX",
    description: "Designing inclusive digital experiences that meet WCAG accessibility standards.",
    score: 8,
    icon: "Accessibility",
  },
  {
    name: "API Platform Builder",
    description: "Architecting and integrating API platforms for scalable service delivery.",
    score: 10,
    icon: "Plug",
  },
  {
    name: "SaaS Launch & Revenue",
    description: "Strategizing, building, and launching SaaS products with revenue-first thinking.",
    score: 10,
    icon: "Rocket",
  },
  {
    name: "AI Product & Evaluation Ops",
    description: "Evaluating AI model outputs, building evals, and optimizing AI-powered products.",
    score: 10,
    icon: "Cpu",
  },
];
