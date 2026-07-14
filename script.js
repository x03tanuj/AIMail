// Core element references
const form = document.getElementById("emailForm");
const recipientName = document.getElementById("recipientName");
const recipientEmail = document.getElementById("recipientEmail");
const emailCategory = document.getElementById("emailCategory");
const subjectInput = document.getElementById("subject");
const purpose = document.getElementById("purpose");
const tone = document.getElementById("tone");
const instructions = document.getElementById("instructions");
const purposeCounter = document.getElementById("purposeCounter");
const generatedSubject = document.getElementById("generatedSubject");
const generatedEmail = document.getElementById("generatedEmail");
const emailOutput = document.getElementById("emailOutput");
const loading = document.getElementById("loading");
const typingText = document.getElementById("typingText");
const quote = document.getElementById("quote");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const openingLines = {
  Professional: ["I hope this message finds you well.", "I trust you are doing well."],
  Academic: ["I hope you're having a productive semester.", "I hope your week is going well."],
  Internship: ["I am writing to express my interest in the opportunity.", "I wanted to connect regarding the internship role."],
  "Leave Application": ["I am writing to formally request leave.", "Please accept this email as my leave request."],
  "Meeting Request": ["I would like to request a meeting at your convenience.", "I am reaching out to schedule a brief discussion."],
  "Follow Up": ["I wanted to follow up on my previous email.", "I am writing to kindly follow up regarding the earlier discussion."],
  Complaint: ["I am writing to bring a concern to your attention.", "I would like to formally report an issue I encountered."],
  Appreciation: ["I would like to sincerely thank you.", "I am writing to express my appreciation."],
  "Job Application": ["I am excited to apply for this role.", "Please consider this as my formal application."],
  General: ["I am reaching out regarding the following matter.", "I wanted to connect with you about this topic."]
};

const tonePhrases = {
  Professional: ["I appreciate your time and consideration.", "Please let me know if any additional details are required."],
  Friendly: ["Thanks so much for your support!", "I'd really appreciate your thoughts."],
  Formal: ["Kindly acknowledge receipt of this email.", "I remain available for further clarification."],
  Casual: ["Thanks for checking this out.", "Let me know what works for you."],
  Persuasive: ["I believe this step will create meaningful impact.", "I am confident this is the right opportunity to proceed."],
  Polite: ["I would be grateful for your guidance.", "Thank you in advance for your response."],
  Confident: ["I am fully prepared to move forward promptly.", "I am confident in delivering the expected outcomes."]
};

const motivationalQuotes = [
  "Great communication opens great opportunities.",
  "A well-written email can change your career path.",
  "Clarity and confidence always stand out."
];

const aiThinkingSteps = ["Analyzing your prompt...", "Selecting best tone and structure...", "Finalizing polished draft..."];

// Utilities
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getSelectedLength = () => document.querySelector("input[name='length']:checked")?.value || "Medium";
const currentDate = () => new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

// UI feedback helper
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// Simple validation checks for required and email format
function validateForm() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fields = [recipientName, recipientEmail, emailCategory, purpose, tone];
  const missing = fields.some((field) => !field.value.trim());

  if (missing) {
    showToast("Please fill all required fields.");
    return false;
  }
  if (!emailPattern.test(recipientEmail.value.trim())) {
    showToast("Please enter a valid email address.");
    return false;
  }
  return true;
}

// Auto-generates a subject when user leaves it blank
function autoGenerateSubject(category, basePurpose) {
  const trimmedPurpose = basePurpose.trim();
  if (!trimmedPurpose) return `${category} Request`;
  const concise = trimmedPurpose.length > 52 ? `${trimmedPurpose.slice(0, 52)}...` : trimmedPurpose;
  return `${category}: ${concise}`;
}

// Builds the dynamic body based on selected options
function buildEmailBody(data) {
  const greeting = data.name ? `Dear ${data.name},` : "Dear Sir/Madam,";
  const opening = randomItem(openingLines[data.category] || openingLines.General);
  const toneLine = randomItem(tonePhrases[data.tone] || tonePhrases.Professional);
  const lengthLine = {
    Short: `${data.purpose.trim()}.`,
    Medium: `${data.purpose.trim()}. I would appreciate your response when convenient.`,
    Detailed: `${data.purpose.trim()}. I have prepared the required context and can share additional details, supporting documents, and timelines as needed.`
  }[data.length];

  const instructionLine = data.instructions.trim() ? `Additional note: ${data.instructions.trim()}.` : "";

  return `${greeting}

Date: ${currentDate()}

${opening}
${lengthLine}
${toneLine}
${instructionLine}

Regards,
Your Name`;
}

// Typing animation for output email text
async function typeEmail(content) {
  generatedEmail.textContent = "";
  for (const char of content) {
    generatedEmail.textContent += char;
    await new Promise((resolve) => setTimeout(resolve, 12));
  }
}

// Fake AI thinking + progress update before final output
async function simulateGenerationFlow() {
  loading.classList.remove("hidden");
  emailOutput.classList.add("hidden");
  quote.textContent = "";

  for (let i = 0; i < aiThinkingSteps.length; i += 1) {
    typingText.textContent = aiThinkingSteps[i];
    progressBar.style.width = `${(i + 1) * 30}%`;
    progressLabel.textContent = `${(i + 1) * 30}%`;
    await new Promise((resolve) => setTimeout(resolve, 550));
  }

  progressBar.style.width = "100%";
  progressLabel.textContent = "100%";
  quote.textContent = randomItem(motivationalQuotes);
  await new Promise((resolve) => setTimeout(resolve, 420));
}

// Main generation handler
async function generateEmail(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const subject = subjectInput.value.trim() || autoGenerateSubject(emailCategory.value, purpose.value);
  const data = {
    name: recipientName.value.trim(),
    category: emailCategory.value,
    purpose: purpose.value,
    tone: tone.value,
    length: getSelectedLength(),
    instructions: instructions.value
  };

  await simulateGenerationFlow();

  generatedSubject.textContent = subject;
  const content = buildEmailBody(data);
  loading.classList.add("hidden");
  emailOutput.classList.remove("hidden");
  await typeEmail(content);
  showToast("Email generated successfully!");
}

// Clipboard helper
async function copyGeneratedEmail() {
  if (emailOutput.classList.contains("hidden")) return showToast("Generate an email first.");
  const copyText = `Subject: ${generatedSubject.textContent}\n\n${generatedEmail.textContent}`;
  await navigator.clipboard.writeText(copyText);
  showToast("Copied to clipboard!");
}

// TXT download helper
function downloadEmail() {
  if (emailOutput.classList.contains("hidden")) return showToast("Generate an email first.");
  const text = `Subject: ${generatedSubject.textContent}\n\n${generatedEmail.textContent}`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ai-email-draft.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Email downloaded as TXT.");
}

// Resets complete UI and form
function clearForm() {
  form.reset();
  purposeCounter.textContent = "0 characters";
  generatedSubject.textContent = "-";
  generatedEmail.textContent = "Your generated email will appear here...";
  progressBar.style.width = "0";
  progressLabel.textContent = "Ready";
  loading.classList.add("hidden");
  emailOutput.classList.add("hidden");
  showToast("Form cleared.");
}

// Dark mode toggler with storage persistence
function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("aiMailTheme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️ Light" : "🌙 Dark";
}

function restoreTheme() {
  const saved = localStorage.getItem("aiMailTheme");
  if (saved === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️ Light";
  }
}

// Event bindings
form.addEventListener("submit", generateEmail);
clearBtn.addEventListener("click", clearForm);
copyBtn.addEventListener("click", () => copyGeneratedEmail().catch(() => showToast("Clipboard access denied.")));
downloadBtn.addEventListener("click", downloadEmail);
purpose.addEventListener("input", () => {
  purposeCounter.textContent = `${purpose.value.length} characters`;
});
themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") form.requestSubmit();
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copyGeneratedEmail().catch(() => showToast("Clipboard access denied."));
  }
});

document.querySelectorAll(".smooth-link").forEach((link) => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

restoreTheme();
