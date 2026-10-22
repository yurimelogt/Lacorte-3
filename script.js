/**
 * Terras Alphaville Cabo Frio - La Côrte Imóveis
 * JavaScript Functionality & Console/Performance Optimization
 */

// Garantir funções globais imediatamente disponíveis no escopo do window
window.openPropertyGallery = function(propertyCode) {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  if (window.propertyGalleries && window.propertyGalleries[propertyCode]) {
    window.currentGallery = window.propertyGalleries[propertyCode];
    window.currentImageIndex = 0;
    renderLightbox();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.openClubGallery = function(startIndex) {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  if (window.clubPhotos && window.clubPhotos.length > 0) {
    window.currentGallery = window.clubPhotos;
    window.currentImageIndex = typeof startIndex === 'number' ? startIndex : 0;
    renderLightbox();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.playVideoModal = function(videoSrc) {
  const videoModal = document.getElementById('videoModal');
  const videoModalPlayer = document.getElementById('videoModalPlayer');
  if (videoModal && videoModalPlayer && videoSrc) {
    videoModalPlayer.src = videoSrc;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Reprodução segura sem erro de console
    const playPromise = videoModalPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(function() {
        // Autoplay bloqueado pelo navegador aguarda interação
        videoModalPlayer.controls = true;
      });
    }
  }
};

function renderLightbox() {
  const lightboxMainImg = document.getElementById('lightboxMainImg');
  const lightboxThumbStrip = document.getElementById('lightboxThumbStrip');
  if (!lightboxMainImg || !lightboxThumbStrip || !window.currentGallery || !window.currentGallery.length) return;

  lightboxMainImg.src = window.currentGallery[window.currentImageIndex];
  lightboxThumbStrip.innerHTML = '';

  window.currentGallery.forEach(function(imgUrl, idx) {
    const thumb = document.createElement('div');
    thumb.className = 'lightbox-thumb-item' + (idx === window.currentImageIndex ? ' active' : '');
    thumb.innerHTML = '<img src="' + imgUrl + '" alt="Miniatura ' + (idx + 1) + '" loading="lazy">';
    thumb.addEventListener('click', function() {
      window.currentImageIndex = idx;
      renderLightbox();
    });
    lightboxThumbStrip.appendChild(thumb);
  });

  const activeThumb = lightboxThumbStrip.querySelector('.lightbox-thumb-item.active');
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Fechar menu mobile ao clicar no link
    mainNav.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        mainNav.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // Header com scroll suave (passive listener para performance no console)
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Miniaturas interativas nos Cards dos Imóveis
  const propertyCards = document.querySelectorAll('.property-card');
  propertyCards.forEach(function(card) {
    const mainImg = card.querySelector('.main-property-img');
    const thumbs = card.querySelectorAll('.thumb-item');

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function(e) {
        e.stopPropagation();
        thumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        const newSrc = thumb.getAttribute('data-full');
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
        }
      });
    });
  });

  // Lightbox Modal Controls
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function() {
      if (window.currentGallery && window.currentGallery.length > 0) {
        window.currentImageIndex = (window.currentImageIndex - 1 + window.currentGallery.length) % window.currentGallery.length;
        renderLightbox();
      }
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function() {
      if (window.currentGallery && window.currentGallery.length > 0) {
        window.currentImageIndex = (window.currentImageIndex + 1) % window.currentGallery.length;
        renderLightbox();
      }
    });
  }

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', function() {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Teclado para navegar ou fechar modal
  document.addEventListener('keydown', function(e) {
    if (lightboxModal && lightboxModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        lightboxClose.click();
      } else if (e.key === 'ArrowLeft' && lightboxPrev) {
        lightboxPrev.click();
      } else if (e.key === 'ArrowRight' && lightboxNext) {
        lightboxNext.click();
      }
    }
  });

  // Video Modal Controls
  const videoModal = document.getElementById('videoModal');
  const videoModalPlayer = document.getElementById('videoModalPlayer');
  const videoModalClose = document.getElementById('videoModalClose');

  if (videoModalClose && videoModal && videoModalPlayer) {
    videoModalClose.addEventListener('click', function() {
      videoModal.classList.remove('open');
      videoModalPlayer.pause();
      videoModalPlayer.src = '';
      document.body.style.overflow = '';
    });
  }

  if (videoModal && videoModalClose) {
    videoModal.addEventListener('click', function(e) {
      if (e.target === videoModal) {
        videoModalClose.click();
      }
    });
  }

  // Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        faqItems.forEach(function(f) { f.classList.remove('active'); });
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Floating WhatsApp Menu
  const floatingBtn = document.getElementById('floatingWhatsappBtn');
  const floatingMenu = document.getElementById('floatingWhatsappMenu');

  if (floatingBtn && floatingMenu) {
    floatingBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      floatingMenu.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      if (!floatingMenu.contains(e.target) && e.target !== floatingBtn) {
        floatingMenu.classList.remove('open');
      }
    });
  }
});
