const tabButtons = document.querySelectorAll(".panel__tabs button");
const authForms = document.querySelectorAll(".panel__form");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authShell = document.querySelector(".auth");

// Recruiter dashboard nodes
const recruiterDashboard = document.querySelector(".dashboard");
const recruiterTabs = document.querySelectorAll(".dashboard__tabs button");
const recruiterPanels = document.querySelectorAll(".dashboard__panel");
const logoutRecruiterBtn = document.getElementById("logout");
const jobForm = document.getElementById("job-form");
const jobListEl = document.getElementById("job-list");
const applicationListEl = document.getElementById("application-list");

// Seeker dashboard nodes
const seekerDashboard = document.querySelector(".dashboard-seeker");
const seekerTabs = document.querySelectorAll(".seeker__tabs button");
const seekerPanels = document.querySelectorAll(".seeker__panel");
const logoutSeekerBtn = document.getElementById("logout-seeker");
const desiredRoleSelect = document.getElementById("desired-role");
const jobCardStack = document.getElementById("job-card-stack");
const resumeForm = document.getElementById("resume-form");
const resumeFileInput = document.getElementById("resume-file");
const atsForm = document.getElementById("ats-form");
const atsResult = document.getElementById("ats-result");
const recommendationList = document.getElementById("recommendation-list");
const atsResumeInput = document.getElementById("ats-resume-file");

const RECRUITER_CREDENTIALS = {
  email: "recruiter@jobtinder.com",
  password: "hireme123",
};

const SEEKER_CREDENTIALS = {
  email: "seeker@jobtinder.com",
  password: "hireme123",
};

const SWIPE_THRESHOLD = 120;

const setActiveForm = (target) => {
  authForms.forEach((form) => {
    form.classList.toggle("active", form.id === `${target}-form`);
  });
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === target);
  });
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveForm(button.dataset.target));
});

// Recruiter dashboard logic
const jobs = [];

const mockApplications = [
  { name: "Alex Kim", role: "Senior Product Designer", score: 94 },
  { name: "Priya Patel", role: "Lead Frontend Engineer", score: 91 },
  { name: "Maya Torres", role: "Growth PM", score: 87 },
  { name: "Noah Bennett", role: "Staff Backend Engineer", score: 84 },
]
  .sort((a, b) => b.score - a.score)
  .map((app, index) => ({ ...app, status: "pending", id: `app-${index}` }));

const renderJobs = () => {
  if (!jobListEl) return;
  jobListEl.innerHTML = jobs.length
    ? jobs
        .map(
          (job) => `
        <li class="job-card">
          <h4>${job.role}</h4>
          <p class="muted small">${job.company}</p>
          <p>${job.description}</p>
        </li>`
        )
        .join("")
    : `<li class="job-card muted">No postings yet. Use the Add job tab to publish your first role.</li>`;
};

const renderApplications = () => {
  if (!applicationListEl) return;
  applicationListEl.innerHTML = mockApplications
    .map((app) => {
      const actions =
        app.status === "pending"
          ? `<div class="application-actions">
              <button class="small-btn accept" data-action="accept" data-id="${app.id}">
                Accept
              </button>
              <button class="small-btn reject" data-action="reject" data-id="${app.id}">
                Reject
              </button>
            </div>`
          : `<p class="muted small">Marked as ${app.status}</p>`;
      return `
        <li class="application-card">
          <div class="application-meta">
            <div>
              <h4>${app.name}</h4>
              <p>${app.role}</p>
            </div>
            <span class="score">${app.score}</span>
          </div>
          ${actions}
        </li>`;
    })
    .join("");
};

const switchRecruiterView = (target) => {
  recruiterPanels.forEach((panel) => {
    panel.classList.toggle(
      "active",
      panel.id === `${target}-panel` || panel.id === `${target}`
    );
  });
  recruiterTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === target);
  });
};

recruiterTabs.forEach((tab) =>
  tab.addEventListener("click", () => switchRecruiterView(tab.dataset.view))
);

const showRecruiterDashboard = () => {
  authShell.style.display = "none";
  recruiterDashboard.hidden = false;
  seekerDashboard.hidden = true;
  renderJobs();
  renderApplications();
  switchRecruiterView("composer");
};

// Job seeker dashboard logic
let selectedRole = "";
let activeMatches = [];

const VISIBLE_MATCH_COUNT = 4;

const jobMatchPool = {
  "Product Designer": [
    {
      title: "Senior Product Designer",
      company: "Gradient Labs",
      location: "Remote • US",
      salary: "$175K + equity",
      description:
        "Ship end-to-end experiences for consumer AI tools, collaborating with product and research pods.",
    },
    {
      title: "Product Design Lead",
      company: "Nova Health",
      location: "Austin, TX",
      salary: "$160K–$190K",
      description:
        "Own the patient journey experience for digital clinics and mentor a team of three designers.",
    },
    {
      title: "Product Designer, Core Experience",
      company: "Atlas Ride",
      location: "NYC • Hybrid",
      salary: "$150K",
      description:
        "Craft multi-platform flows, partner with research to run weekly tests, and evolve the motion system.",
    },
    {
      title: "Growth Product Designer",
      company: "Clair",
      location: "Remote • Europe",
      salary: "€120K",
      description:
        "Design onboarding experiments, launch modular paywall components, and align data dashboards with design teams.",
    },
  ],
  "Frontend Engineer": [
    {
      title: "Staff Frontend Engineer",
      company: "Pulse Analytics",
      location: "NYC • Hybrid",
      salary: "$210K base",
      description:
        "Lead the web guild, modernize our design system, and improve performance for 3M monthly users.",
    },
    {
      title: "Senior React Engineer",
      company: "Driftline",
      location: "Remote",
      salary: "$180K + bonus",
      description:
        "Ship new onboarding flows and experiment rapidly with growth squads using Remix and GraphQL.",
    },
    {
      title: "Frontend Architect",
      company: "Harbor",
      location: "San Francisco, CA",
      salary: "$230K + equity",
      description:
        "Lead migration to React Server Components, elevate accessibility standards, and mentor the web chapter.",
    },
    {
      title: "Principal UI Engineer",
      company: "OrbitPay",
      location: "Remote • APAC",
      salary: "$190K",
      description:
        "Build high-fidelity dashboards with WebGL visualizations, owning performance budgets end to end.",
    },
  ],
  "Growth PM": [
    {
      title: "Growth Product Manager",
      company: "Shoreline",
      location: "Remote • North America",
      salary: "$165K–$185K",
      description:
        "Scale self-serve monetization experiments, manage activation squads, and partner with data science.",
    },
    {
      title: "Lifecycle PM",
      company: "Arcade",
      location: "Los Angeles, CA",
      salary: "$150K + equity",
      description:
        "Design multi-channel campaigns, iterate on paywall experiences, and own churn reduction roadmap.",
    },
    {
      title: "Activation PM",
      company: "Zephyr",
      location: "Remote • Americas",
      salary: "$155K",
      description:
        "Lead onboarding funnel squad, run weekly experiments, and improve activation rate by double digits.",
    },
    {
      title: "Self-Serve Monetization PM",
      company: "Frame.io",
      location: "Boston, MA",
      salary: "$165K + bonus",
      description:
        "Own pricing experiments, coordinate with finance, and stand up ARR dashboards for exec reviews.",
    },
  ],
  "Gen AI Engineer": [
    {
      title: "Founding GenAI Engineer",
      company: "Promptly",
      location: "Remote • Global",
      salary: "$220K + equity",
      description:
        "Prototype retrieval-augmented generation pipelines and productionize LLM-powered copilots for enterprise clients.",
    },
    {
      title: "Applied AI Engineer",
      company: "Nebula Systems",
      location: "Seattle, WA",
      salary: "$200K base",
      description:
        "Fine-tune frontier models, build evaluation harnesses, and deploy real-time inference services across edge devices.",
    },
    {
      title: "Generative AI Platform Engineer",
      company: "Lux Labs",
      location: "Remote • US",
      salary: "$210K",
      description:
        "Create internal tooling for dataset curation, vector search, and prompt experimentation with guardrails.",
    },
    {
      title: "AI Solutions Engineer",
      company: "Northwind",
      location: "London, UK",
      salary: "£155K",
      description:
        "Embed with enterprise customers, stand up LLM copilots, and benchmark latency/reliability in production.",
    },
  ],
  "Data Scientist": [
    {
      title: "Lead Data Scientist",
      company: "Crescent Credit",
      location: "Chicago, IL",
      salary: "$185K + bonus",
      description:
        "Own risk modeling roadmap, partner with product to ship experimentation frameworks, and mentor a team of four.",
    },
    {
      title: "Product Analytics Scientist",
      company: "Lyric",
      location: "Remote • US",
      salary: "$165K",
      description:
        "Analyze user funnels, build propensity models, and influence growth bets with causal inference toolkits.",
    },
    {
      title: "Senior ML Scientist",
      company: "NovaBio",
      location: "Remote",
      salary: "$180K",
      description:
        "Predict patient adherence, deploy ML pipelines, and collaborate with clinicians on experiment design.",
    },
    {
      title: "Quantitative Product Scientist",
      company: "Sparrow",
      location: "Denver, CO",
      salary: "$172K",
      description:
        "Model marketplace liquidity, build anomaly detection, and translate findings into roadmap priorities.",
    },
  ],
  "Backend Developer": [
    {
      title: "Senior Backend Engineer",
      company: "Atlas Freight",
      location: "Toronto, ON",
      salary: "$170K CAD",
      description:
        "Scale event-driven services in Go, optimize GraphQL APIs, and improve observability across the logistics platform.",
    },
    {
      title: "Platform Engineer",
      company: "Conifer",
      location: "Denver, CO",
      salary: "$175K",
      description:
        "Modernize microservices, harden Kubernetes clusters, and lead performance audits for mission-critical workloads.",
    },
    {
      title: "Distributed Systems Engineer",
      company: "Layer0",
      location: "Remote • Global",
      salary: "$185K",
      description:
        "Build low-latency messaging services, tune Kafka pipelines, and improve autoscaling strategy.",
    },
    {
      title: "Backend Engineer, Payments",
      company: "Quill",
      location: "Austin, TX",
      salary: "$165K + equity",
      description:
        "Own PCI-compliant services, ship new ledger features, and drive API reliability metrics.",
    },
  ],
  "Full Stack Engineer": [
    {
      title: "Full Stack Staff Engineer",
      company: "Sway",
      location: "Remote • Americas",
      salary: "$190K + equity",
      description:
        "Ship rapid experiments across Next.js and Node, align design system updates, and guide junior builders.",
    },
    {
      title: "Senior Product Engineer",
      company: "Orbit Digital",
      location: "Berlin, Germany",
      salary: "€130K",
      description:
        "Own end-to-end features using TypeScript, build resilient APIs, and collaborate directly with PM + design.",
    },
    {
      title: "Full Stack Engineer, Creator Tools",
      company: "Muse",
      location: "Remote • Europe",
      salary: "€125K",
      description:
        "Prototype collaborative features with Supabase + Next.js, owning metrics from ideation to launch.",
    },
    {
      title: "Product-focused Engineer",
      company: "Beacon",
      location: "Portland, OR",
      salary: "$165K",
      description:
        "Pair with designers daily, ship TypeScript/Node features, and maintain GraphQL gateways.",
    },
  ],
};

const seekerRoleCursor = {};

const seekerRecommendations = [
  {
    title: "Show outcomes for each role",
    detail: "Lead bullets with impact metrics (conversion lifts, ARR, adoption).",
  },
  {
    title: "Mirror JD keywords",
    detail: "Sprinkle frameworks (JTBD, OKRs) and stacks (React, GraphQL) to improve ATS hits.",
  },
  {
    title: "Highlight leadership moments",
    detail: "Call out times you coached designers or engineers to ship faster.",
  },
];

const renderRecommendations = () => {
  if (!recommendationList) return;
  recommendationList.innerHTML = seekerRecommendations
    .map(
      (rec) => `
      <li class="recommendation-card">
        <h4>${rec.title}</h4>
        <p class="muted small">${rec.detail}</p>
      </li>`
    )
    .join("");
};

const renderMatchCards = () => {
  if (!jobCardStack) return;
  if (!selectedRole) {
    jobCardStack.innerHTML = `<p class="muted small">Choose a role above to load personalized matches.</p>`;
    return;
  }
  if (!activeMatches.length) {
    jobCardStack.innerHTML = `<p class="muted small">Fetching the next ${selectedRole} matches...</p>`;
    return;
  }
  jobCardStack.innerHTML = activeMatches
    .map(
      (job) => `
    <article class="match-card" data-id="${job.id}">
      <p class="eyebrow small">${job.role}</p>
      <h4>${job.title}</h4>
      <p class="muted small">${job.company} • ${job.location}</p>
      <p class="muted small">${job.salary}</p>
      <div class="match-card__description">
        <p>${job.description}</p>
      </div>
      <div class="match-card__actions">
        <button class="match-btn reject" data-action="reject" data-id="${job.id}">Swipe left</button>
        <button class="match-btn accept" data-action="accept" data-id="${job.id}">Swipe right</button>
      </div>
    </article>`
    )
    .join("");
  attachSwipeHandlers();
};

function processMatchAction(id, action) {
  const removedJob = activeMatches.find((job) => job.id === id);
  activeMatches = activeMatches.filter((job) => job.id !== id);
  const roleForNext = removedJob?.role || selectedRole;
  if (roleForNext) {
    const nextJob = getNextJobCard(roleForNext);
    if (nextJob) {
      activeMatches.push(nextJob);
    }
  }
  renderMatchCards();
  const sentiment = action === "accept" ? "saved" : "passed on";
  console.info(`You ${sentiment} job ${removedJob?.title ?? id}`);
}

function attachSwipeHandlers() {
  if (!jobCardStack) return;
  const cards = jobCardStack.querySelectorAll(".match-card");
  cards.forEach((card) => initSwipeOnCard(card));
}

function initSwipeOnCard(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const resetCard = () => {
    card.style.transition = "transform 0.2s ease, opacity 0.2s ease";
    card.style.transform = "";
    card.style.opacity = "";
    setTimeout(() => {
      card.style.transition = "";
    }, 200);
  };

  const completeSwipe = (action) => {
    card.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    const direction = action === "accept" ? 1 : -1;
    card.style.transform = `translateX(${direction * 400}px) rotate(${direction * 25}deg)`;
    card.style.opacity = "0";
    setTimeout(() => processMatchAction(card.dataset.id, action), 200);
  };

  const handlePointerDown = (event) => {
    if (event.button && event.button !== 0) return;
    if (event.target.closest(".match-card__actions")) return;
    isDragging = true;
    startX = event.clientX;
    card.setPointerCapture?.(event.pointerId);
    card.classList.add("dragging");
    card.style.transition = "none";
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    currentX = event.clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 20}deg)`;
    card.style.opacity = `${Math.max(1 - Math.abs(currentX) / 400, 0.4)}`;
  };

  const endDrag = (event, shouldComplete = true) => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove("dragging");
    card.releasePointerCapture?.(event.pointerId);
    if (shouldComplete && Math.abs(currentX) > SWIPE_THRESHOLD) {
      completeSwipe(currentX > 0 ? "accept" : "reject");
    } else {
      resetCard();
    }
    currentX = 0;
  };

  card.addEventListener("pointerdown", handlePointerDown);
  card.addEventListener("pointermove", handlePointerMove);
  card.addEventListener("pointerup", (event) => endDrag(event, true));
  card.addEventListener("pointercancel", (event) => endDrag(event, false));
  card.addEventListener("pointerleave", (event) => endDrag(event, false));
}

const ensureRoleCursor = (role, reset = false) => {
  if (reset || seekerRoleCursor[role] === undefined) {
    seekerRoleCursor[role] = 0;
  }
};

const getNextJobCard = (role) => {
  const pool = jobMatchPool[role] || [];
  if (!pool.length) return null;
  ensureRoleCursor(role);
  const index = seekerRoleCursor[role];
  const jobTemplate = pool[index];
  seekerRoleCursor[role] = (index + 1) % pool.length;
  const uniqueId = `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  return { ...jobTemplate, role, id: uniqueId };
};

const seedMatches = (role, count = VISIBLE_MATCH_COUNT) => {
  const matches = [];
  for (let i = 0; i < count; i += 1) {
    const nextJob = getNextJobCard(role);
    if (nextJob) {
      matches.push(nextJob);
    }
  }
  return matches;
};

const setDesiredRole = (role) => {
  selectedRole = role;
  if (!role) {
    activeMatches = [];
    renderMatchCards();
    return;
  }
  ensureRoleCursor(role, true);
  activeMatches = seedMatches(role, VISIBLE_MATCH_COUNT);
  renderMatchCards();
};

desiredRoleSelect?.addEventListener("change", (event) => {
  setDesiredRole(event.target.value);
});

jobCardStack?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { id, action } = button.dataset;
  processMatchAction(id, action);
});

const switchSeekerView = (target) => {
  seekerPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${target}-panel`);
  });
  seekerTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === target);
  });
};

seekerTabs.forEach((tab) =>
  tab.addEventListener("click", () => switchSeekerView(tab.dataset.view))
);

const showSeekerDashboard = () => {
  authShell.style.display = "none";
  recruiterDashboard.hidden = true;
  seekerDashboard.hidden = false;
  switchSeekerView("seek-main");
  renderMatchCards();
  renderRecommendations();
  if (atsResult) atsResult.textContent = "";
};

// Shared helpers
const resetExperience = () => {
  authShell.style.display = "";
  recruiterDashboard.hidden = true;
  seekerDashboard.hidden = true;
  loginForm.reset();
  signupForm.reset();
  switchRecruiterView("composer");
  switchSeekerView("seek-main");
  if (desiredRoleSelect) desiredRoleSelect.value = "";
  selectedRole = "";
  activeMatches = [];
  renderMatchCards();
  if (atsResult) atsResult.textContent = "";
};

logoutRecruiterBtn?.addEventListener("click", resetExperience);
logoutSeekerBtn?.addEventListener("click", resetExperience);

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(loginForm).entries());
  if (
    data.email === RECRUITER_CREDENTIALS.email &&
    data.password === RECRUITER_CREDENTIALS.password
  ) {
    showRecruiterDashboard();
    return;
  }

  if (
    data.email === SEEKER_CREDENTIALS.email &&
    data.password === SEEKER_CREDENTIALS.password
  ) {
    showSeekerDashboard();
    return;
  }

  alert("Use the preview recruiter or job seeker credentials listed above.");
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(signupForm).entries());
  alert(`Signing up: ${JSON.stringify(data, null, 2)}`);
});

jobForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(jobForm).entries());
  jobs.unshift(formData);
  jobForm.reset();
  renderJobs();
  switchRecruiterView("active");
});

applicationListEl?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { id, action } = button.dataset;
  const application = mockApplications.find((app) => app.id === id);
  if (!application || application.status !== "pending") return;
  application.status = action === "accept" ? "accepted" : "rejected";
  renderApplications();
});

resumeForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = resumeFileInput?.files?.[0];
  if (!file) {
    alert("Upload a resume file so the AI can fine-tune it.");
    return;
  }
  alert(`AI fine-tuning ${file.name}... (logic coming soon)`);
});

atsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const jobDescription = atsForm.querySelector('textarea[name="ats-job"]')?.value.trim();
  const resumeFile = atsResumeInput?.files?.[0];
  if (!jobDescription) {
    if (atsResult) atsResult.textContent = "Paste the target job description to run an ATS scan.";
    return;
  }
  if (!resumeFile) {
    if (atsResult) atsResult.textContent = "Upload your resume file so we can compare it to the JD.";
    return;
  }
  if (atsResult) atsResult.textContent = "Scanning resume against the JD...";
  setTimeout(() => {
    const score = Math.floor(60 + Math.random() * 35);
    if (atsResult) {
      atsResult.textContent = `Simulated ATS score for ${resumeFile.name}: ${score}/100. Mirror critical keywords to boost it.`;
    }
  }, 400);
});

renderRecommendations();

// ---------------------------
// ATS SCORE FUNCTIONALITY
// ---------------------------

// Extract text from uploaded file
async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // PDF files
    if (file.type === "application/pdf") {
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let text = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((s) => s.str).join(" ") + "\n";
          }

          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    // DOC / DOCX files (simple text extraction)
    else {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.readAsText(file);
    }
  });
}

// ---------------------------
// Calculate ATS Match Score
// ---------------------------

function computeATSScore(resumeText, jdText) {
  const resumeWords = resumeText.toLowerCase().split(/\W+/);
  const jdWords = jdText.toLowerCase().split(/\W+/);

  const resumeSet = new Set(resumeWords);
  const jdSet = new Set(jdWords);

  let matched = 0;

  jdSet.forEach((word) => {
    if (resumeSet.has(word)) matched++;
  });

  const score = Math.round((matched / jdSet.size) * 100);
  return score;
}

// ---------------------------
// Handle ATS Form Submission
// ---------------------------

document.getElementById("ats-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const jd = document.querySelector("textarea[name='ats-job']").value.trim();
  const file = document.getElementById("ats-resume-file").files[0];
  const resultDiv = document.getElementById("ats-result");

  if (!jd) {
    resultDiv.innerHTML = "<span style='color:red'>Please paste a Job Description.</span>";
    return;
  }

  if (!file) {
    resultDiv.innerHTML = "<span style='color:red'>Upload a resume file.</span>";
    return;
  }

  resultDiv.innerHTML = "Scanning your resume against the JD… 🔍";

  try {
    const resumeText = await extractTextFromFile(file);
    const score = computeATSScore(resumeText, jd);

    resultDiv.innerHTML = `
      <h3>ATS Match Score: <strong>${score}%</strong></h3>
      ${score >= 70
        ? "<p style='color:green'>🔥 Strong match! Your resume aligns well.</p>"
        : "<p style='color:#d9534f'>⚠️ Weak match — you should add missing skills.</p>"}
    `;
  } catch (error) {
    resultDiv.innerHTML = "<span style='color:red'>Error processing file.</span>";
  }
});
// ---------------------------
// GEMINI RESUME BUILDER
// ---------------------------

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyD-Ev8tMMt53UjiJBOWkzenw4HlhPdVL4Q");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ---------------------------
// Extract Text From PDF/DOC
// ---------------------------

async function extractResumeText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // PDF extraction
    if (file.type === "application/pdf") {
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((s) => s.str).join(" ") + "\n";
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    // DOC / DOCX fallback
    else {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.readAsText(file);
    }
  });
}

// ---------------------------
// Gemini HTML Resume Generator
// ---------------------------

async function generateBetterResumeWithGemini(resumeText) {
  const prompt = `
You are a professional resume writer. Rewrite this resume into a clean modern HTML resume.
Requirements:
- Clean typography, modern design
- Proper sections: Summary, Skills, Experience, Education, Projects
- No inline CSS; use <style> inside HTML
- Use professional formatting, spacing
- Make improvements but DO NOT hallucinate fake experience
- Return ONLY full HTML, nothing else

Resume content:
${resumeText}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ----------------------------
// Convert HTML → PDF
// ----------------------------

function downloadResumePDF(htmlContent) {
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  html2pdf()
    .set({
      margin: 10,
      filename: "Enhanced_Resume.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save()
    .then(() => document.body.removeChild(element));
}

// -----------------------------------------
// Main Handler: Upload → Enhance → Download
// -----------------------------------------

document.getElementById("resume-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("resume-file").files[0];
  const output = document.getElementById("resume-output");

  if (!file) {
    output.innerHTML = "<span style='color:red'>Please upload a resume.</span>";
    return;
  }

  output.innerHTML = "Extracting your resume… ⏳";

  try {
    const resumeText = await extractResumeText(file);

    output.innerHTML = "Enhancing with Gemini AI… 🤖✨";

    const enhancedHTML = await generateBetterResumeWithGemini(resumeText);

    output.innerHTML = `
      <h3>Enhanced Resume Preview:</h3>
      ${enhancedHTML}
      <button id="download-pdf" class="primary" style="margin-top:10px">
        Download PDF
      </button>
    `;

    document.getElementById("download-pdf").onclick = () =>
      downloadResumePDF(enhancedHTML);

  } catch (err) {
    output.innerHTML = "<span style='color:red'>Error generating resume.</span>";
    console.log(err);
  }
});
