"use strict";

/* =========================================================
   LANGUAGE SWITCH
========================================================= */

const langButtons = document.querySelectorAll(".lang-btn");

const textItems = document.querySelectorAll(
  "[data-en][data-ka]"
);

const placeholderItems = document.querySelectorAll(
  "[data-placeholder-en][data-placeholder-ka]"
);

let currentLang =
  localStorage.getItem("invite-language") || "ka";


function setLanguage(lang) {
  currentLang = lang;

  localStorage.setItem(
    "invite-language",
    lang
  );

  document.documentElement.lang = lang;

  textItems.forEach((item) => {
    const text = item.getAttribute(`data-${lang}`);

    if (!text) {
      return;
    }

    if (text.includes("<br>")) {
      item.innerHTML = text;
    } else {
      item.textContent = text;
    }
  });

  placeholderItems.forEach((item) => {
    const value = item.getAttribute(
      `data-placeholder-${lang}`
    );

    if (value) {
      item.placeholder = value;
    }
  });

  langButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.lang === lang
    );
  });
}


langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});


setLanguage(currentLang);


/* =========================================================
   INTRO AND MUSIC
========================================================= */

const introScreen =
  document.getElementById("introScreen");

const openInvitation =
  document.getElementById("openInvitation");

const header =
  document.querySelector(".site-header");

const bgMusic =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");


function updateMusicButton() {
  if (!musicToggle || !bgMusic) {
    return;
  }

  musicToggle.classList.toggle(
    "playing",
    !bgMusic.paused
  );

  musicToggle.textContent =
    bgMusic.paused ? "♪" : "♫";

  musicToggle.setAttribute(
    "aria-label",
    bgMusic.paused
      ? "მუსიკის ჩართვა"
      : "მუსიკის გამორთვა"
  );
}


function playMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.volume = 0.3;

  bgMusic
    .play()
    .then(() => {
      updateMusicButton();
    })
    .catch(() => {
      updateMusicButton();
    });
}


openInvitation?.addEventListener(
  "click",
  () => {
    document.body.classList.remove(
      "intro-locked"
    );

    document.body.classList.add(
      "experience-started"
    );

    introScreen?.classList.add("opened");

    header?.classList.add("visible");

    musicToggle?.classList.add("visible");

    playMusic();

    setTimeout(() => {
      introScreen?.remove();
    }, 1000);
  }
);


musicToggle?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    if (!bgMusic) {
      return;
    }

    if (bgMusic.paused) {
      playMusic();
    } else {
      bgMusic.pause();
      updateMusicButton();
    }
  }
);


bgMusic?.addEventListener(
  "play",
  updateMusicButton
);

bgMusic?.addEventListener(
  "pause",
  updateMusicButton
);

updateMusicButton();


/* =========================================================
   COUNTDOWN
========================================================= */

/*
  ქორწილის თარიღი:
  6 სექტემბერი, 2026
  16:30 — თბილისის დრო
*/

const weddingDate = new Date(
  "2026-09-06T16:30:00+04:00"
).getTime();


function updateCountdown() {
  const distance =
    weddingDate - Date.now();

  const ids = [
    "days",
    "hours",
    "minutes",
    "seconds"
  ];

  const elements = ids.map((id) =>
    document.getElementById(id)
  );

  if (
    elements.some((element) => !element)
  ) {
    return;
  }

  if (distance <= 0) {
    elements.forEach((element) => {
      element.textContent = "00";
    });

    return;
  }

  const days = Math.floor(
    distance / 86400000
  );

  const hours = Math.floor(
    distance / 3600000
  ) % 24;

  const minutes = Math.floor(
    distance / 60000
  ) % 60;

  const seconds = Math.floor(
    distance / 1000
  ) % 60;

  const values = [
    days,
    hours,
    minutes,
    seconds
  ];

  elements.forEach(
    (element, index) => {
      element.textContent = String(
        values[index]
      ).padStart(2, "0");
    }
  );
}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   RSVP
========================================================= */

const rsvpForm =
  document.querySelector(".rsvp-form");

const rsvpButton =
  rsvpForm?.querySelector(
    'button[type="submit"]'
  );


function resetRsvpButton() {
  if (!rsvpButton) {
    return;
  }

  rsvpButton.textContent =
    currentLang === "ka"
      ? "გაგზავნა"
      : "Send RSVP";

  rsvpButton.classList.remove(
    "sent",
    "error"
  );
}


rsvpForm?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (!rsvpButton) {
      return;
    }

    const guestName =
      rsvpForm.elements.name
        .value
        .trim();

    if (!guestName) {
      rsvpButton.textContent =
        currentLang === "ka"
          ? "შეავსეთ სახელი"
          : "Enter your name";

      rsvpButton.classList.remove(
        "sent"
      );

      rsvpButton.classList.add(
        "error"
      );

      setTimeout(
        resetRsvpButton,
        1700
      );

      return;
    }

    rsvpButton.textContent =
      currentLang === "ka"
        ? "გაგზავნილია"
        : "Sent";

    rsvpButton.classList.remove(
      "error"
    );

    rsvpButton.classList.add(
      "sent"
    );

    setTimeout(() => {
      rsvpForm.reset();

      resetRsvpButton();
    }, 2200);
  }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealItems =
  document.querySelectorAll(
    [
      ".letter-inner",
      ".ornament-photo-frame",
      ".countdown",
      ".detail",
      ".section-heading",
      ".timeline-item",
      ".rsvp-heading",
      ".rsvp-form"
    ].join(",")
  );


if (
  "IntersectionObserver" in window
) {
  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "show"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold:0.12,
        rootMargin:
          "0px 0px -40px 0px"
      }
    );


  revealItems.forEach(
    (item, index) => {
      item.classList.add("reveal");

      item.style.transitionDelay =
        `${Math.min(
          index % 4,
          3
        ) * 0.08}s`;

      observer.observe(item);
    }
  );
} else {
  revealItems.forEach((item) => {
    item.classList.add(
      "reveal",
      "show"
    );
  });
}


/* =========================================================
   HEADER VISIBILITY
========================================================= */

function updateHeaderState() {
  if (!header) {
    return;
  }

  if (
    document.body.classList.contains(
      "intro-locked"
    )
  ) {
    return;
  }

  header.classList.add("visible");
}


window.addEventListener(
  "scroll",
  updateHeaderState,
  {
    passive:true
  }
);


/* =========================================================
   INTERNAL LINKS
========================================================= */

const internalLinks =
  document.querySelectorAll(
    'a[href^="#"]'
  );


internalLinks.forEach((link) => {
  link.addEventListener(
    "click",
    (event) => {
      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(
          targetId
        );

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    }
  );
});


/* =========================================================
   PAGE RESTORE
========================================================= */

window.addEventListener(
  "pageshow",
  () => {
    updateMusicButton();

    if (
      !document.body.classList.contains(
        "intro-locked"
      )
    ) {
      header?.classList.add(
        "visible"
      );

      musicToggle?.classList.add(
        "visible"
      );
    }
  }
);