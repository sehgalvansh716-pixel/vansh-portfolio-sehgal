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
    name: "Prompt Engineering",
    description: "Crafting precise instructions to elicit optimal responses from AI models.",
    score: 10,
    icon: "Terminal",
  },
  {
    name: "AI Workflow Design",
    description: "Designing end-to-end automated workflows integrating AI capabilities.",
    score: 10,
    icon: "GitBranch",
  },
  {
    name: "AI Productivity Systems",
    description: "Building systems that leverage AI to multiply personal and team productivity.",
    score: 9,
    icon: "Zap",
  },
  {
    name: "AI Documentation",
    description: "Using AI tools to rapidly generate, structure, and maintain project documentation.",
    score: 9,
    icon: "FileText",
  },
  {
    name: "AI Research",
    description: "Accelerating research phases using AI agents to synthesize information.",
    score: 10,
    icon: "Search",
  },
  {
    name: "AI-Assisted Data Analysis",
    description: "Leveraging AI to explore datasets, clean data, and extract actionable insights.",
    score: 10,
    icon: "BarChart2",
  },
  {
    name: "Business Analytics",
    description: "Translating business needs into data-driven decisions and operational improvements.",
    score: 9,
    icon: "TrendingUp",
  },
  {
    name: "SQL (Foundational)",
    description: "Querying relational databases to extract and manipulate structured data.",
    score: 8,
    icon: "Database",
  },
  {
    name: "Tableau (Foundational)",
    description: "Building foundational visual dashboards to communicate data narratives.",
    score: 8,
    icon: "PieChart",
  },
  {
    name: "Excel & Google Sheets",
    description: "Advanced spreadsheet operations, data modeling, and pivot table analysis.",
    score: 10,
    icon: "Table",
  },
  {
    name: "Process Optimization",
    description: "Identifying bottlenecks and streamlining operational workflows for efficiency.",
    score: 10,
    icon: "Settings",
  },
  {
    name: "Digital Documentation",
    description: "Maintaining clear, accessible, and structured digital records for organizations.",
    score: 10,
    icon: "Folder",
  },
];
