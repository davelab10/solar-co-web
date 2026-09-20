const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const form = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.hidden = true;
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const processVisual = document.querySelector(".process-visual");
const processSteps = document.querySelectorAll(".process-step");
if (processVisual && "IntersectionObserver" in window) {
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const stage = entry.target.dataset.stage;
      processVisual.dataset.stage = stage;
      processSteps.forEach((step) => step.classList.toggle("is-active", step === entry.target));
    });
  }, { threshold: 0.65, rootMargin: "-12% 0px -35%" });
  processSteps.forEach((step) => processObserver.observe(step));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.hidden = false;

  if (!form.checkValidity()) {
    formStatus.dataset.state = "error";
    formStatus.textContent = "Please complete each required field before sending your enquiry.";
    form.querySelector(":invalid")?.focus();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  form.setAttribute("aria-busy", "true");
  formStatus.dataset.state = "loading";
  formStatus.textContent = "Sending your details";

  window.setTimeout(() => {
    formStatus.dataset.state = "success";
    formStatus.textContent = "Thanks. We've received your details.";
    form.reset();
    submitButton.disabled = false;
    form.removeAttribute("aria-busy");
  }, 700);
});
