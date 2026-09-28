/**
 * Madhavbaug - Black Garlic Immunity Prash Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Product Gallery Slider (Touch Swipe, Arrows & Thumbnails)
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryViewport = document.getElementById('galleryViewport');
  const slides = document.querySelectorAll('.gallery-slide');
  const thumbs = document.querySelectorAll('.gallery-thumbnails .thumb-item');
  const dots = document.querySelectorAll('.gallery-dot');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (totalSlides === 0) return;
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    if (galleryTrack) {
      galleryTrack.classList.remove('is-dragging');
      galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Next / Prev Button Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide - 1);
    });
  }

  // Thumbnail Click Listeners
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      goToSlide(i);
    });
  });

  // Dot Click Listeners
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
  });

  // Touch Swipe & Drag Support
  if (galleryViewport && galleryTrack) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isHorizontalSwipe = null;

    galleryViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      isDragging = true;
      isHorizontalSwipe = null;
      galleryTrack.classList.add('is-dragging');
    }, { passive: true });

    galleryViewport.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (isHorizontalSwipe === null) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      if (isHorizontalSwipe) {
        const width = galleryViewport.offsetWidth || 1;
        const offsetPercent = (diffX / width) * 100;
        const currentTranslate = -currentSlide * 100 + offsetPercent;
        galleryTrack.style.transform = `translateX(${currentTranslate}%)`;
      }
    }, { passive: true });

    galleryViewport.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      galleryTrack.classList.remove('is-dragging');
      const diffX = currentX - startX;
      const threshold = 45; // min px to trigger slide

      if (isHorizontalSwipe && Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          goToSlide(currentSlide - 1);
        } else {
          goToSlide(currentSlide + 1);
        }
      } else {
        goToSlide(currentSlide);
      }
      isHorizontalSwipe = null;
    });

    // Mouse Drag Support for Desktop
    let mouseStartX = 0;
    let isMouseDown = false;

    galleryViewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      mouseStartX = e.clientX;
      isMouseDown = true;
      galleryTrack.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const diffX = e.clientX - mouseStartX;
      const width = galleryViewport.offsetWidth || 1;
      const offsetPercent = (diffX / width) * 100;
      const currentTranslate = -currentSlide * 100 + offsetPercent;
      galleryTrack.style.transform = `translateX(${currentTranslate}%)`;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      galleryTrack.classList.remove('is-dragging');
      const diffX = e.clientX - mouseStartX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          goToSlide(currentSlide - 1);
        } else {
          goToSlide(currentSlide + 1);
        }
      } else {
        goToSlide(currentSlide);
      }
    });
  }

  // 2. Pricing & Bundle Selector State
  let currentBundle = {
    title: '1 जार (Madhavbaug Immunity Prash • 30 दिन की खुराक)',
    price: 1899,
    originalPrice: 2499,
    savings: '24% की बचत'
  };

  const bundleCards = document.querySelectorAll('.bundle-card');
  const priceDisplay = document.getElementById('currentPrice');
  const originalPriceDisplay = document.getElementById('originalPrice');
  const discountTag = document.getElementById('discountTag');

  bundleCards.forEach(card => {
    card.addEventListener('click', () => {
      bundleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const price = parseInt(card.getAttribute('data-price'), 10);
      const original = parseInt(card.getAttribute('data-original'), 10);
      const discount = card.getAttribute('data-discount');
      const title = card.getAttribute('data-title');

      currentBundle = {
        title: title,
        price: price,
        originalPrice: original,
        savings: discount
      };

      if (priceDisplay) priceDisplay.textContent = `₹${price.toLocaleString('en-IN')}`;
      if (originalPriceDisplay) originalPriceDisplay.textContent = `₹${original.toLocaleString('en-IN')}`;
      if (discountTag) discountTag.textContent = discount;
    });
  });

  // 3. Quantity Steppers
  let quantity = 1;
  const qtyVal = document.getElementById('qtyValue');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyVal.textContent = quantity;
      }
    });

    qtyPlus.addEventListener('click', () => {
      quantity++;
      qtyVal.textContent = quantity;
    });
  }

  // 4. Cart State & Drawer
  let cartItems = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartItemsBody');
  const cartSubtotal = document.getElementById('cartSubtotal');

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function updateCartUI() {
    const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalCount;

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--antique-gold);">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p style="font-weight: 700; font-size: 1.1rem; color: var(--herbal-green-dark);">आपकी Heart Care कार्ट खाली है</p>
          <p style="font-size: 0.9rem; margin-top: 6px;">अपने दिल की सेहत, कोलेस्ट्रॉल और ब्लड प्रेशर संतुलन के लिए Madhavbaug Hradaya Prash जोड़ें।</p>
        </div>
      `;
      if (cartSubtotal) cartSubtotal.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cartItems.map((item, idx) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <img src="${item.img}" class="cart-item-img" alt="${item.title}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="font-size: 0.82rem; color: #2F692E; font-weight: 600;">✓ फ्री एक्सप्रेस डिलीवरी + 24K गोल्ड चम्मच</span>
              <button onclick="window.removeCartItem(${idx})" style="color: #9c4141; font-size: 0.82rem; font-weight: 600;">हटाएं (Remove)</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  }

  window.removeCartItem = function(index) {
    cartItems.splice(index, 1);
    updateCartUI();
  };

  // Toast Notification
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Add to Cart Handlers
  const addCartBtns = document.querySelectorAll('.btn-add-to-cart, #stickyAddToCart');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const existing = cartItems.find(i => i.title === currentBundle.title);
      if (existing) {
        existing.qty += quantity;
      } else {
        cartItems.push({
          title: `Madhavbaug Immunity Prash (${currentBundle.title})`,
          price: currentBundle.price,
          qty: quantity,
          img: 'assets/images/hero_jar.jpg'
        });
      }
      updateCartUI();
      showToast(`${quantity} × ${currentBundle.title} कार्ट में जोड़ा गया!`);
      openCart();
    });
  });

  // ==========================================================================
  // GOOGLE SHEET & LEAD MODALS (WITH 24-HOUR DUPLICATE PHONE CHECK)
  // ==========================================================================
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzHj7Zm62KwC1xK-x1t3OQLD5WT6AQx6HI2UKaOT3Ds4XEJTnnEtZeRxR94dc8V0AQhyg/exec';

  const callbackModal = document.getElementById('callbackModal');
  const callbackModalClose = document.getElementById('callbackModalClose');
  const callbackForm = document.getElementById('callbackForm');
  const callbackSubmitBtn = document.getElementById('callbackSubmitBtn');
  
  const thankYouModal = document.getElementById('thankYouModal');
  const thankYouModalClose = document.getElementById('thankYouModalClose');
  const thankYouModalDoneBtn = document.getElementById('thankYouModalDoneBtn');
  const thankYouCustomerName = document.getElementById('thankYouCustomerName');
  const thankYouPhone = document.getElementById('thankYouPhone');
  const thankYouCity = document.getElementById('thankYouCity');

  const duplicateModal = document.getElementById('duplicateModal');
  const duplicateModalClose = document.getElementById('duplicateModalClose');
  const duplicateModalDoneBtn = document.getElementById('duplicateModalDoneBtn');
  const duplicatePhoneDisplay = document.getElementById('duplicatePhoneDisplay');

  const ctaButtons = document.querySelectorAll('.btn-buy-now, #heroBuyNow, #stickyBuyNow');

  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  // Local 24-Hour Cooldown Check Helpers
  function getPhoneStorageKey(phone) {
    return `madhavbaug_lead_${phone}`;
  }

  function isPhoneSubmittedWithin24Hours(phone) {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, '').slice(-10);
    const storedTime = localStorage.getItem(getPhoneStorageKey(clean));
    if (!storedTime) return false;
    const timeDiff = Date.now() - parseInt(storedTime, 10);
    return timeDiff < TWENTY_FOUR_HOURS_MS;
  }

  function markPhoneAsSubmitted(phone) {
    if (!phone) return;
    const clean = phone.replace(/\D/g, '').slice(-10);
    localStorage.setItem(getPhoneStorageKey(clean), Date.now().toString());
  }

  function openCallbackModal() {
    if (!callbackModal) return;
    callbackModal.classList.add('active');
    callbackModal.setAttribute('aria-hidden', 'false');
    const nameInput = document.getElementById('callbackName');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }

  function closeCallbackModal() {
    if (!callbackModal) return;
    callbackModal.classList.remove('active');
    callbackModal.setAttribute('aria-hidden', 'true');
  }

  function openThankYouModal(name, phone, city) {
    if (!thankYouModal) return;
    if (thankYouCustomerName) thankYouCustomerName.textContent = name || 'ग्राहक जी';
    if (thankYouPhone) thankYouPhone.textContent = phone ? `+91 ${phone}` : '+91 ••••••••••';
    if (thankYouCity) thankYouCity.textContent = city || 'भारत';
    
    thankYouModal.classList.add('active');
    thankYouModal.setAttribute('aria-hidden', 'false');
  }

  function closeThankYouModal() {
    if (!thankYouModal) return;
    thankYouModal.classList.remove('active');
    thankYouModal.setAttribute('aria-hidden', 'true');
  }

  function openDuplicateModal(phone) {
    if (!duplicateModal) return;
    if (duplicatePhoneDisplay) {
      duplicatePhoneDisplay.textContent = phone ? `+91 ${phone}` : '+91 ••••••••••';
    }
    duplicateModal.classList.add('active');
    duplicateModal.setAttribute('aria-hidden', 'false');
  }

  function closeDuplicateModal() {
    if (!duplicateModal) return;
    duplicateModal.classList.remove('active');
    duplicateModal.setAttribute('aria-hidden', 'true');
  }

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCallbackModal();
    });
  });

  if (callbackModalClose) {
    callbackModalClose.addEventListener('click', closeCallbackModal);
  }

  if (thankYouModalClose) {
    thankYouModalClose.addEventListener('click', closeThankYouModal);
  }

  if (thankYouModalDoneBtn) {
    thankYouModalDoneBtn.addEventListener('click', closeThankYouModal);
  }

  if (duplicateModalClose) {
    duplicateModalClose.addEventListener('click', closeDuplicateModal);
  }

  if (duplicateModalDoneBtn) {
    duplicateModalDoneBtn.addEventListener('click', closeDuplicateModal);
  }

  if (callbackModal) {
    callbackModal.addEventListener('click', (e) => {
      if (e.target === callbackModal) {
        closeCallbackModal();
      }
    });
  }

  if (thankYouModal) {
    thankYouModal.addEventListener('click', (e) => {
      if (e.target === thankYouModal) {
        closeThankYouModal();
      }
    });
  }

  if (duplicateModal) {
    duplicateModal.addEventListener('click', (e) => {
      if (e.target === duplicateModal) {
        closeDuplicateModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (callbackModal && callbackModal.classList.contains('active')) {
        closeCallbackModal();
      }
      if (thankYouModal && thankYouModal.classList.contains('active')) {
        closeThankYouModal();
      }
      if (duplicateModal && duplicateModal.classList.contains('active')) {
        closeDuplicateModal();
      }
    }
  });

  if (callbackForm) {
    callbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('callbackName')?.value.trim() || 'ग्राहक जी';
      const rawPhone = document.getElementById('callbackPhone')?.value.trim() || '';
      const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
      const city = document.getElementById('callbackCity')?.value.trim() || '';

      if (cleanPhone.length !== 10) {
        alert('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
        return;
      }

      // Step 1: Client-side instant 24-hour duplicate check
      if (isPhoneSubmittedWithin24Hours(cleanPhone)) {
        closeCallbackModal();
        openDuplicateModal(cleanPhone);
        return;
      }

      // Button Loading State
      const originalBtnHtml = callbackSubmitBtn ? callbackSubmitBtn.innerHTML : '';
      if (callbackSubmitBtn) {
        callbackSubmitBtn.disabled = true;
        callbackSubmitBtn.innerHTML = `
          <svg class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          रिक्वेस्ट दर्ज हो रही है...
        `;
      }

      const payload = {
        name: name,
        contact: cleanPhone,
        city: city,
        bundle: currentBundle ? currentBundle.title : 'Madhavbaug Immunity Prash (1 Jar)',
        price: currentBundle ? `₹${currentBundle.price.toLocaleString('en-IN')}` : '₹1,899',
        source: 'Madhavbaug Immunity Official Website'
      };

      try {
        let isDuplicateFromServer = false;

        // Step 2: Send data to Google Sheet if Web App URL is configured
        if (GOOGLE_SHEET_WEB_APP_URL && GOOGLE_SHEET_WEB_APP_URL.startsWith('http')) {
          try {
            const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain;charset=utf-8'
              },
              body: JSON.stringify(payload)
            });

            if (response.ok) {
              const result = await response.json();
              if (result && result.result === 'duplicate') {
                isDuplicateFromServer = true;
              }
            }
          } catch (fetchErr) {
            console.warn('Google Sheet fetch fallback:', fetchErr);
            // Even if network restricts CORS, request reached or we fallback gracefully
          }
        }

        // Handle Duplicate or Success
        closeCallbackModal();

        if (isDuplicateFromServer) {
          markPhoneAsSubmitted(cleanPhone);
          setTimeout(() => {
            openDuplicateModal(cleanPhone);
          }, 200);
        } else {
          markPhoneAsSubmitted(cleanPhone);
          setTimeout(() => {
            openThankYouModal(name, cleanPhone, city);
            showToast(`🎉 धन्यवाद ${name}! कॉलबैक रिक्वेस्ट दर्ज हो गई है।`);
          }, 200);
          callbackForm.reset();
        }

      } catch (err) {
        console.error('Submission error:', err);
        closeCallbackModal();
        markPhoneAsSubmitted(cleanPhone);
        setTimeout(() => {
          openThankYouModal(name, cleanPhone, city);
        }, 200);
      } finally {
        if (callbackSubmitBtn) {
          callbackSubmitBtn.disabled = false;
          callbackSubmitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // 6. Accordion FAQs
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      // If wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstAns = faqItems[0].querySelector('.faq-answer');
    if (firstAns) firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
  }

  // 7. Sticky Mobile Bar Observer
  const stickyBar = document.getElementById('stickyMobileBar');
  const heroCTA = document.querySelector('#heroBuyNow, .product-info-col .btn-buy-now');

  if (stickyBar && heroCTA && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && window.innerWidth <= 768) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }, { rootMargin: '0px 0px -50px 0px' });

    observer.observe(heroCTA);
  }

  // 8. Review Filters
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      reviewCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-tag') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 9. Write Review Modal
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewForm = document.getElementById('sampleReviewForm');

  if (writeReviewBtn && reviewModal) {
    writeReviewBtn.addEventListener('click', () => {
      reviewModal.classList.add('active');
    });
  }

  if (reviewModalClose && reviewModal) {
    reviewModalClose.addEventListener('click', () => {
      reviewModal.classList.remove('active');
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      reviewModal.classList.remove('active');
      showToast('धन्यवाद! आपकी प्रतिक्रिया सत्यापन के लिए प्राप्त हो गई है।');
    });
  }

  // Navbar scroll background effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Initialize Cart UI
  updateCartUI();
});
