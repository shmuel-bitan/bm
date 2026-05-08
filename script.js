/*
  =========================================================
  BAR MITZVAH WEBSITE JAVASCRIPT
  - Countdown
  - Mobile menu
  - Scroll animations
  - RSVP placeholder logic
  =========================================================
*/

/*
  EDIT THE EVENT DATE HERE.
  Format: "YYYY-MM-DDTHH:mm:ss"
  Example below: 28 June 2026 at 08:15, Paris time.
*/
const EVENT_DATE = "2026-06-28T08:15:00+02:00";

// Countdown elements
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  const eventTime = new Date(EVENT_DATE).getTime();
  const now = new Date().getTime();
  const distance = eventTime - now;

  if (distance <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Header style on scroll
const header = document.querySelector(".site-header");

function updateHeader() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

updateHeader();
window.addEventListener("scroll", updateHeader);

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Reveal animations
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => observer.observe(element));

// RSVP form placeholder
const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const data = Object.fromEntries(formData.entries());

  /*
    FRONT-END ONLY FOR NOW.
    Later, connect this part to your service.

    Example with a backend API:
    fetch("https://your-api.com/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    Example with Formspree:
    - Replace form action="#" in index.html with your Formspree URL
    - Remove event.preventDefault() if you want native form submission
  */

  console.log("RSVP data:", data);

  formStatus.textContent =
    "Merci, votre réponse a bien été préparée. Connexion au formulaire à ajouter ensuite.";

  rsvpForm.reset();
});


// Premium photo carousel
const carousel = document.getElementById("photoCarousel");
const carouselTrack = document.getElementById("carouselTrack");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselDots = document.getElementById("carouselDots");

let currentSlide = 0;
let carouselInterval;

function createCarouselDots() {
  carouselSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", `Aller à la photo ${index + 1}`);

    dot.addEventListener("click", () => {
      goToSlide(index);
      resetCarouselAutoplay();
    });

    carouselDots.appendChild(dot);
  });
}

function updateCarousel() {
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  carouselSlides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  const dots = document.querySelectorAll(".carousel-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselSlides.length;
  updateCarousel();
}

function prevSlide() {
  currentSlide =
    (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
  updateCarousel();
}

function startCarouselAutoplay() {
  carouselInterval = setInterval(nextSlide, 4500);
}

function stopCarouselAutoplay() {
  clearInterval(carouselInterval);
}

function resetCarouselAutoplay() {
  stopCarouselAutoplay();
  startCarouselAutoplay();
}

if (carousel && carouselTrack && carouselSlides.length > 0) {
  createCarouselDots();
  updateCarousel();
  startCarouselAutoplay();

  carouselNext.addEventListener("click", () => {
    nextSlide();
    resetCarouselAutoplay();
  });

  carouselPrev.addEventListener("click", () => {
    prevSlide();
    resetCarouselAutoplay();
  });

  carousel.addEventListener("mouseenter", stopCarouselAutoplay);
  carousel.addEventListener("mouseleave", startCarouselAutoplay);
}

const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

let musicStarted = false;

function updateMusicButton() {
  if (!backgroundMusic || !musicToggle) return;

  if (backgroundMusic.paused) {
    musicToggle.textContent = "🔇";
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "Activer la musique");
  } else {
    musicToggle.textContent = "🔊";
    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-label", "Couper la musique");
  }
}

async function startMusic() {
  if (!backgroundMusic || musicStarted) return;

  try {
    backgroundMusic.volume = 0.45;
    await backgroundMusic.play();
    musicStarted = true;
    updateMusicButton();
  } catch (error) {
    // Le navigateur bloque souvent l'autoplay avec son.
    // La musique démarrera au premier clic de l'utilisateur.
  }
}

if (backgroundMusic && musicToggle) {
  startMusic();

  document.addEventListener(
    "click",
    () => {
      startMusic();
    },
    { once: true }
  );

  musicToggle.addEventListener("click", async function (event) {
    event.stopPropagation();

    if (backgroundMusic.paused) {
      try {
        backgroundMusic.volume = 0.45;
        await backgroundMusic.play();
        musicStarted = true;
      } catch (error) {
        console.log("Lecture audio bloquée par le navigateur.");
      }
    } else {
      backgroundMusic.pause();
    }

    updateMusicButton();
  });

  updateMusicButton();
}