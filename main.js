// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="group1"]');
  const container = document.querySelector('.card-blog-container');
  const originalCards = Array.from(document.querySelectorAll('.card-blog'));
  const allCards = Array.from(container.querySelectorAll('.card-blog'));
  const totalOriginal = originalCards.length;
  let currentIndex = totalOriginal; // Start at first real card (after the clones)

  const menuMobile = document.querySelector('.mobile-container')
  const computedDisplay = window.getComputedStyle(menuMobile).display;

  const page = document.querySelector('.page');

  const contactBtn = document.getElementById('contactBtn');
  const contactTarget = document.getElementById('Contactamos');

  if (originalCards.length === 0) return;

  // Clone all original cards before and after
  originalCards.forEach(card => {
    const beforeClone = card.cloneNode(true);
    const afterClone = card.cloneNode(true);
    beforeClone.classList.add('clone', 'card-blog');
    afterClone.classList.add('clone', 'card-blog');
    container.insertBefore(beforeClone, container.firstChild);
    container.appendChild(afterClone);
  });



  function getOffset(index) {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const card = allCards[i];
      const style = getComputedStyle(card);
      const width = card.offsetWidth;
      const margin = parseFloat(style.marginRight || 0);
      offset += width + margin + 16; // Add gap (16px)
    }
    return offset;
  }

  function slideTo(index) {
    const offset = getOffset(index);
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(-${offset}px)`;
    currentIndex = index;
  }

  // Handle looping on transition end
  container.addEventListener('transitionend', () => {
    container.style.transition = 'none';

    if (currentIndex < totalOriginal) {
      // Jump from clones-before to real content
      currentIndex += totalOriginal;
      const offset = getOffset(currentIndex);
      container.style.transform = `translateX(-${offset}px)`;
    }

    if (currentIndex >= totalOriginal * 2) {
      // Jump from clones-after to real content
      currentIndex -= totalOriginal;
      const offset = getOffset(currentIndex);
      container.style.transform = `translateX(-${offset}px)`;
    }

    // Restore transition for next move
    setTimeout(() => {
      container.style.transition = 'transform 0.5s ease-in-out';
    }, 10);
  });

  // Add event listeners to radio buttons
  radios.forEach((radio, i) => {
    radio.addEventListener('change', () => {
      // Shift index by +originalCards.length to land in center
      slideTo(i + totalOriginal);
    });
  });

  // Initialize at the first actual card
  slideTo(totalOriginal);
  //if (window.matchMedia("(max-width: 992px)").matches) {

  if (computedDisplay === 'flex') {
    const menuButton = document.getElementById('menuBtn');
    const menu = document.querySelector('.mobile_menu'); // ← fixed selector
    const closeButton = document.getElementById('btnClose');
    menuButton.addEventListener('click', function () {
      // Toggle visibility
      if (menu.style.display === 'flex') {
        setTimeout(() => {
          menu.style.display = 'none';
        }, 0);
      } else {
        setTimeout(() => {
          menu.style.display = 'flex';
        }, 0);
      }
    });

    closeButton.addEventListener('click', function () {
      menu.style.display = 'none';
    });
  }
  window.addEventListener("resize", function () {
    if (computedDisplay === 'flex') {
      // if (window.matchMedia("(max-width: 992px)").matches) {
      const menuButton = document.getElementById('menuBtn');
      const menu = document.querySelector('.mobile_menu'); // ← fixed selector
      const closeButton = document.getElementById('btnClose');
      menuButton.addEventListener('click', function () {
        // Toggle visibility
        if (menu.style.display === 'flex') {
          setTimeout(() => {
            menu.style.display = 'none';
          }, 0);
        } else {
          setTimeout(() => {
            menu.style.display = 'flex';
          }, 0);
        }
      });

      closeButton.addEventListener('click', function () {
        menu.style.display = 'none';
      });
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl && page.contains(targetEl)) {
        e.preventDefault();
        const offsetTop = targetEl.offsetTop;

        page.scrollTo({
          top: offsetTop - 80, // Offset to prevent it being hidden under menu
          behavior: 'smooth'
        });
      }
    });
  });

  if (contactBtn && contactTarget && page.contains(contactTarget)) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const offsetTop = contactTarget.offsetTop;

      page.scrollTo({
        top: offsetTop - 80, // Match the offset used for anchor links
        behavior: 'smooth'
      });
    });
  }
});
