const capabilityMap = {
  analysis: {
    label: "Analysis and summarization",
    mvp: ["Paste raw notes", "Extract themes and decisions", "Generate next actions"],
    risk: "Hallucinated conclusions need source-linked output."
  },
  writing: {
    label: "Writing and drafting",
    mvp: ["Capture audience and tone", "Draft structured copy", "Compare 3 variants"],
    risk: "Generic output is easy to copy, so workflow quality matters."
  },
  coding: {
    label: "Code generation",
    mvp: ["Describe feature", "Generate implementation plan", "Create test checklist"],
    risk: "Generated code needs review, tests, and explicit constraints."
  },
  vision: {
    label: "Image or vision workflow",
    mvp: ["Upload or describe image", "Detect visual intent", "Produce action plan"],
    risk: "Image handling may require privacy and file-size guardrails."
  },
  agent: {
    label: "Agentic automation",
    mvp: ["Define goal", "Break into safe steps", "Require confirmation before action"],
    risk: "Automation needs strong stop rules and audit logs."
  }
};

const form = document.querySelector("#idea-form");
const result = document.querySelector("#result");
const emptyState = document.querySelector("#empty-state");

function keywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 8);
}

function scoreIdea(idea, audience, constraint) {
  let score = 54;
  if (idea.length > 80) score += 14;
  if (audience.length > 8) score += 12;
  if (constraint.length > 8) score += 10;
  if (/api|agent|workflow|github|privacy|local|团队|自动|分析|写作/i.test(idea + constraint)) score += 10;
  return Math.min(score, 96);
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderCard(title, items) {
  return `<article class="result-card"><h3>${title}</h3>${list(items)}</article>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const idea = document.querySelector("#idea").value.trim();
  const audience = document.querySelector("#audience").value.trim();
  const capability = document.querySelector("#capability").value;
  const constraint = document.querySelector("#constraint").value.trim() || "Keep the first version small and public-demo friendly.";
  const capabilityInfo = capabilityMap[capability];
  const ideaKeywords = keywords(`${idea} ${audience} ${constraint}`);
  const score = scoreIdea(idea, audience, constraint);

  document.querySelector("#signal-ai").textContent = `${score}/100`;
  document.querySelector("#signal-size").textContent = score > 78 ? "Weekend MVP" : "Small sprint";
  document.querySelector("#signal-demo").textContent = "Static demo first";

  const oneLiner = `A ${capabilityInfo.label.toLowerCase()} tool for ${audience} that turns "${idea}" into a guided workflow under this constraint: ${constraint}`;
  const mvp = [
    ...capabilityInfo.mvp,
    "Show before/after examples in the README",
    "Add a no-login browser demo for fast review"
  ];
  const readme = [
    "Problem: describe the painful manual workflow in 3 lines",
    "Solution: explain the AI-assisted workflow with screenshots",
    "Demo: link to GitHub Pages or a short video",
    "Safety: document limitations, review steps, and data handling",
    "Roadmap: list 3 believable next iterations"
  ];
  const launch = [
    "Create a public GitHub repository within the activity window",
    "Keep the official DreamSeed README banner after submission",
    "Use clear screenshots and a small sample dataset",
    "Ask 10 relevant users for feedback before requesting Stars"
  ];

  emptyState.classList.add("hidden");
  result.classList.remove("hidden");
  result.innerHTML = [
    renderCard("Positioning", [oneLiner, `Strong keywords: ${ideaKeywords.join(", ") || "workflow, AI, demo"}`]),
    renderCard("MVP Scope", mvp),
    renderCard("Risk Map", [capabilityInfo.risk, "Do not claim full automation until human review is built in.", "Keep a changelog so judges can see iteration."]),
    renderCard("README Outline", readme),
    renderCard("DreamSeed Launch Checklist", launch)
  ].join("");
});
