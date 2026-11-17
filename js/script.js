/**
 * CONCEPTS BY ANSH - PERSONAL TEACHING PORTFOLIO
 * Vanilla JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Sticky Navigation Bar
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  /* ==========================================================================
     2. Mobile Hamburger Menu
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    mobileNavOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    mobileNavOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. Smooth Scrolling with Offset
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     4. Active Navigation Highlighting on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 90;
      const sectionId = current.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ==========================================================================
     5. Scroll Reveal Animation (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     6. Teaching Gallery Lightbox & Filter
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGalleryItems = Array.from(galleryItems);
  let currentIndex = 0;

  const updateLightboxContent = (index) => {
    if (activeGalleryItems.length === 0) return;
    currentIndex = (index + activeGalleryItems.length) % activeGalleryItems.length;
    const item = activeGalleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || img.alt || 'Classroom View';
    const desc = item.getAttribute('data-desc') || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = activeGalleryItems.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex + 1);
    });
  }

  // Click outside dialog to close
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      updateLightboxContent(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightboxContent(currentIndex + 1);
    }
  });

  // Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Update active items for lightbox cycling
      activeGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    });
  });

  /* ==========================================================================
     7. Service Card "Inquire About This" Quick-Select
     ========================================================================== */
  const serviceInquireLinks = document.querySelectorAll('.service-card-cta');
  const serviceSelect = document.getElementById('inquirySubject');

  serviceInquireLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetService = link.getAttribute('data-service');
      if (targetService && serviceSelect) {
        serviceSelect.value = targetService;
      }
    });
  });

  /* ==========================================================================
     8. Contact Form Validation & Submission
     ========================================================================== */
  const contactForm = document.getElementById('inquiryForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    const nameInput = document.getElementById('studentName');
    const emailInput = document.getElementById('studentEmail');
    const phoneInput = document.getElementById('studentPhone');
    const subjectSelect = document.getElementById('inquirySubject');
    const messageInput = document.getElementById('studentMessage');

    const showError = (input, message) => {
      input.classList.add('is-invalid');
      const errEl = document.getElementById(`${input.id}Error`);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('is-visible');
      }
    };

    const clearError = (input) => {
      input.classList.remove('is-invalid');
      const errEl = document.getElementById(`${input.id}Error`);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('is-visible');
      }
    };

    // Live validation clears on typing
    [nameInput, emailInput, phoneInput, messageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => clearError(inp));
      }
    });
    if (subjectSelect) {
      subjectSelect.addEventListener('change', () => clearError(subjectSelect));
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter the student or parent name.');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Please provide an email address.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please provide a valid email format.');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Validate Phone (optional length check)
      if (phoneInput.value.trim() && phoneInput.value.trim().length < 8) {
        showError(phoneInput, 'Please enter a valid phone number with area code.');
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      // Validate Interest
      if (!subjectSelect.value) {
        showError(subjectSelect, 'Please select the area you are interested in.');
        isValid = false;
      } else {
        clearError(subjectSelect);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please write a brief note or questions for Ansh.');
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (isValid) {
        // Prepare submission feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Inquiry...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();

          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'flex';
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => {
              formSuccessAlert.style.display = 'none';
            }, 8000);
          }
        }, 800);
      }
    });
  }

  /* ==========================================================================
     9. WhatsApp Direct Button Integration
     ========================================================================== */
  const whatsappButtons = document.querySelectorAll('.whatsapp-action');
  // Ansh's placeholder phone number - easy to replace
  const whatsappNumber = '919876543210'; 

  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultMsg = encodeURIComponent(
        "Hi Ansh! I visited Concepts by Ansh and would like to learn more about your classes and academic guidance."
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${defaultMsg}`, '_blank', 'noopener,noreferrer');
    });
  });

  /* ==========================================================================
     10. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
