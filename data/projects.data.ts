export type Project = {
  id: string;
  title: string;
  description: string;
  longDesc: string;
  category: "projects" | "training" | "tools";
  tags: string[];
  liveUrl: string;
  githubUrl: string | null;
  coverColor: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "deloitte-simulation",
    title: "Deloitte Data Analytics Simulation",
    description: "Corporate-grade data forensics and analytics simulation with Deloitte via Forage.",
    longDesc:
      "Executed practical tasks modeled after real-world Deloitte tech consulting projects. Applied data analysis and forensic technology workflows to solve complex operational challenges, producing structured insights and a certified deliverable.",
    category: "training",
    tags: ["Data Analytics", "Excel", "Forensic Tech", "Deloitte", "Consulting"],
    liveUrl: "/images/projects/deloitte.jpeg",
    githubUrl: null,
    coverColor: "#0B2A1A",
    featured: true,
  },
  {
    id: "google-analytics-capstone",
    title: "Google Data Analytics Capstone",
    description: "End-to-end data analysis project using SQL, Tableau, and R — Google Coursera capstone.",
    longDesc:
      "Analyzing real-world datasets using SQL for querying, R for statistical modeling, and Tableau for visualization dashboards. Translating findings into structured business recommendations as the final capstone of the Google Data Analytics Professional Certificate.",
    category: "projects",
    tags: ["SQL", "Tableau", "R Programming", "Google Sheets", "Data Viz"],
    liveUrl: "/images/projects/google-analytics.jpeg",
    githubUrl: null,
    coverColor: "#071A10",
    featured: true,
  },
  {
    id: "ai-workflow-templates",
    title: "AI Workflow Automation Templates",
    description: "Prompt-engineered AI workflow templates to automate documentation and operational tasks.",
    longDesc:
      "Designed and tested a suite of AI-powered workflow templates using ChatGPT and Gemini APIs. Templates reduce manual documentation overhead, optimize task-execution speed, and are structured for reuse across administrative and operational contexts.",
    category: "tools",
    tags: ["Prompt Engineering", "ChatGPT", "Gemini", "Automation", "Productivity"],
    liveUrl: "/images/projects/ai-workflow.jpeg",
    githubUrl: null,
    coverColor: "#0A1A12",
    featured: true,
  },
  {
    id: "frankfinn-service-project",
    title: "Frankfinn Customer Excellence Project",
    description: "1-year intensive hospitality training culminating in passenger service recovery simulations.",
    longDesc:
      "Developed and demonstrated professional-grade customer service protocols through airline operations, travel booking systems, and live conflict resolution role-play. Built the cross-cultural communication skills required for high-stakes client-facing roles.",
    category: "training",
    tags: ["Customer Service", "Hospitality", "Conflict Resolution", "Client Relations"],
    liveUrl: "/images/projects/frankfinn.jpeg",
    githubUrl: null,
    coverColor: "#0C1A11",
    featured: false,
  },
  {
    id: "nsdc-data-ops",
    title: "NSDC Grade-A Data Operations",
    description: "Government-accredited data entry and digital records management — achieved Grade A (top tier).",
    longDesc:
      "Completed a 6-month NSDC/Skill India certified program in high-volume data entry and digital records management. Achieved Grade A — the top performance tier — with a certified 40 WPM typing speed, structured records processing, and spreadsheet formatting proficiency.",
    category: "training",
    tags: ["Data Entry", "Digital Records", "NSDC", "Skill India", "Excel"],
    liveUrl: "/images/projects/nsdc.jpeg",
    githubUrl: null,
    coverColor: "#091810",
    featured: false,
  },
];
