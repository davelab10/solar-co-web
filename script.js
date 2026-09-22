const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

function closeMenu(returnFocus = false) {
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  if (returnFocus && wasOpen) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 960px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const system = document.querySelector('#system');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let flowTimer;

function playEnergyFlow() {
  clearTimeout(flowTimer);
  system.classList.remove('is-flowing');
  if (reducedMotion.matches) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      system.classList.add('is-flowing');
      flowTimer = setTimeout(() => system.classList.remove('is-flowing'), 3600);
    });
  });
}
reducedMotion.addEventListener('change', () => {
  clearTimeout(flowTimer);
  system.classList.remove('is-flowing');
});

const scenarios = {
  'day-true': {
    label: 'Daytime / solar + battery',
    title: "Use it now. Store what's available.",
    copy: 'Your home uses available solar generation. Excess energy can charge the battery. Depending on your system and electricity arrangement, additional excess may be exported to the grid.'
  },
  'day-false': {
    label: 'Daytime / solar',
    title: 'Put daylight to work at home.',
    copy: 'Available solar generation supplies your home as it is produced. Without a battery, excess generation is not stored at home. It may be exported, depending on your system and electricity arrangement.'
  },
  'evening-true': {
    label: 'Evening / solar + battery',
    title: 'Use energy saved earlier.',
    copy: 'Panels stop generating after daylight. A battery can supply stored energy, if available. Your grid connection can provide additional electricity when storage is low or household demand is greater.'
  },
  'evening-false': {
    label: 'Evening / solar',
    title: 'The grid is still part of the plan.',
    copy: 'After daylight, panels are not generating. With no battery storage, a grid-connected home draws its electricity from the grid. Daytime generation and evening use both inform the right system for you.'
  }
};

function updateScenario() {
  const scenario = scenarios[`${system.dataset.time}-${system.dataset.battery}`];
  document.querySelector('#scenario-label').textContent = scenario.label;
  document.querySelector('#scenario-title').textContent = scenario.title;
  document.querySelector('#scenario-copy').textContent = scenario.copy;
  playEnergyFlow();
}
document.querySelectorAll('[data-time-choice]').forEach(button => {
  button.addEventListener('click', () => {
    system.dataset.time = button.dataset.timeChoice;
    document.querySelectorAll('[data-time-choice]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    updateScenario();
  });
});
document.querySelector('#include-battery').addEventListener('change', event => {
  system.dataset.battery = String(event.target.checked);
  updateScenario();
});

const components = {
  sun: ['Sunlight', 'Daylight provides the source energy for your solar panels. The amount available changes through the day and with the weather.'],
  panels: ['Solar panels', 'Panels convert sunlight into direct current (DC) electricity. Their output changes with daylight, weather and the conditions on your roof.'],
  inverter: ['Inverter', 'The inverter converts direct current (DC) from the panels into alternating current (AC) that your home can use.'],
  home: ['Your home', 'Your home uses available solar generation as electricity is needed. When and how much power your household uses are important parts of system design.'],
  battery: ['Battery storage', 'A battery can store excess solar generation for later. The energy available depends on generation, household use, storage capacity and system design.'],
  grid: ['Grid connection', 'A grid-connected home can import additional electricity when needed. It may also export excess generation, depending on the system and electricity arrangement.']
};
document.querySelectorAll('button[data-component]').forEach(button => {
  button.addEventListener('click', () => {
    system.dataset.component = button.dataset.component;
    document.querySelectorAll('button[data-component]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    const [title, copy] = components[button.dataset.component];
    document.querySelector('#component-title').textContent = title;
    document.querySelector('#component-copy').textContent = copy;
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playEnergyFlow();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(document.querySelector('.system-illustration'));
}

const roofDetails = {
  orientation: 'The direction and pitch of each roof face affect how it receives sunlight through the day.',
  sunlight: 'Available daylight and seasonal sun exposure help determine what the roof can generate.',
  shading: 'Nearby trees, buildings and roof features can cast shade. Their position matters when planning a system.',
  area: 'Usable roof space, roof features and practical constraints shape where panels can fit.'
};
document.querySelectorAll('[data-roof]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.roof-figure').dataset.roofState = button.dataset.roof;
    document.querySelector('#roof-detail').textContent = roofDetails[button.dataset.roof];
    document.querySelectorAll('[data-roof]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});

document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#quote-interest').value = link.dataset.interest;
  });
});

const form = document.querySelector('#quote-form');
const formStatus = document.querySelector('#form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  formStatus.hidden = false;
  const name = form.elements.name;
  const location = form.elements.location;
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  location.setCustomValidity(location.value.trim() ? '' : 'Please enter your postcode or suburb.');
  if (!form.checkValidity()) {
    form.classList.add('is-invalid');
    formStatus.dataset.state = 'error';
    formStatus.textContent = 'Please enter your name, a valid email address, and your postcode or suburb.';
    form.querySelector(':invalid').focus();
    return;
  }
  form.classList.remove('is-invalid');
  formStatus.dataset.state = 'demo';
  formStatus.textContent = 'Your demonstration enquiry is complete. No details have been sent or stored. This form is for the design presentation only.';
});
form.addEventListener('input', event => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  if (!formStatus.hidden) {
    formStatus.hidden = true;
    form.classList.remove('is-invalid');
  }
});
