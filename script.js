/* Toggle Icon */
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("ri-close-line"); // x icon দেখাবে
  menuIcon.classList.toggle("ri-menu-line"); // menu icon লুকাবে
  navbar.classList.toggle("active"); // navbar খোলে/বন্ধ হয়
};

/* Scroll Section Active Link */
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
      });
      document
        .querySelector('header nav a[href*="' + id + '"]')
        .classList.add("active");
    }
  });
};

/* Sticky Navbar */
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("sticky", window.scrollY > 0);

  // menu বন্ধ হলে icon reset হবে
  menuIcon.classList.remove("ri-close-line");
  menuIcon.classList.add("ri-menu-line");
  navbar.classList.remove("active");
});

/* Scroll Reveal */
ScrollReveal({
  // reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(
  ".home-img, .services-container, .portfolio-box, .contact form",
  { origin: "bottom" },
);
ScrollReveal().reveal(".home-content h1, .about-img", { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content", { origin: "right" });

const typed = new Typed(".multiple-text", {
  strings: ["Frontend Developer", "Web Developer", "Web Designer"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 100,
  loop: true,
});
