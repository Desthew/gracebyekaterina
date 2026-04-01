const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('is-visible');

    // Mobile browsers (especially iOS Safari) may delay video loading until it's explicitly asked.
    // Trigger loading/play when the revealed block enters the viewport.
    const videos = entry.target.querySelectorAll('video');
    videos.forEach((video) => {
      try {
        video.load();
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) {
        // Autoplay can be blocked; loading is still the best-effort goal here.
      }
    });

    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const initBurgerMenu = () => {
  const toggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');
  const overlay = document.getElementById('menu-overlay');
  const sideMenu = document.getElementById('site-menu');
  if (!toggle || !closeBtn || !overlay || !sideMenu) return;

  const openMenu = () => {
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    sideMenu.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    sideMenu.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('menu-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  sideMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
};

const sparks = document.querySelectorAll('.gold-spark');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  sparks.forEach((spark, index) => {
    const factor = (index + 1) * 8;
    spark.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// Autoplay on mobile can be blocked until the first user gesture.
// Best-effort fallback: when the user touches/clicks the page, try to play/load review videos.
const tryPlayReviewVideos = () => {
  document.querySelectorAll('#reviews video.review-video').forEach((video) => {
    try {
      video.muted = true;
      video.load();
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {
      // Ignore autoplay/play errors.
    }
  });
};

const onFirstGesture = () => tryPlayReviewVideos();
window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });
window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
window.addEventListener('click', onFirstGesture, { once: true });

const OFFER_TIMER_KEY = 'grace_offer_deadline_ts';
const OFFER_DURATION_MS = 15 * 60 * 1000;

const getOfferDeadline = () => {
  const saved = Number(localStorage.getItem(OFFER_TIMER_KEY));
  if (Number.isFinite(saved) && saved > Date.now()) return saved;

  const deadline = Date.now() + OFFER_DURATION_MS;
  localStorage.setItem(OFFER_TIMER_KEY, String(deadline));
  return deadline;
};

const pad2 = (num) => String(num).padStart(2, '0');

const initOfferTimer = () => {
  const d = document.getElementById('timer-days');
  const h = document.getElementById('timer-hours');
  const m = document.getElementById('timer-minutes');
  const s = document.getElementById('timer-seconds');
  if (!d || !h || !m || !s) return;

  const deadline = getOfferDeadline();

  const render = () => {
    const diffMs = Math.max(0, deadline - Date.now());
    const totalSec = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    d.textContent = pad2(days);
    h.textContent = pad2(hours);
    m.textContent = pad2(minutes);
    s.textContent = pad2(seconds);
  };

  render();
  setInterval(render, 1000);
};

initOfferTimer();

const I18N_STORAGE_KEY = 'grace_site_lang';
const SUPPORTED_LANGS = ['en', 'es'];

const translations = {
  en: {
    navBio: 'Biography',
    navForYou: 'For you',
    navReviews: 'Reviews',
    navPrice: 'Price',
    navFaq: 'FAQ',
    menuTitle: 'Menu',
    joinNow: 'Join now',
    heroTitle: 'You forgot what it feels like to move and feel like a woman.',
    heroQuote: "In 10 lessons with a World Champion, you won't just learn to belly dance. You'll get that feeling back. For good.",
    discoverMore: 'Discover More',
    startNow: 'Start now',
    onePrice: 'One clear price',
    bioEyebrow: 'Biography',
    bioText: "My name is EKATERINA OLEINIKOVA. I am a two-time World Champion in belly dance, a judge at international competitions in 30+ countries, and a teacher with 16 years of experience. But most importantly - I have taught thousands of women with no experience to dance with confidence and beauty. Now it's your turn.",
    fitEyebrow: 'Perfect match',
    fitTitle: 'This program is for you if...',
    fitSubtitle: 'If these words sound like you, this course was made for your journey.',
    fit1: "You've never danced before - but secretly dreamed of moving gracefully like a goddess.",
    fit2: "You're done with boring workouts - and want something joyful, feminine and fun instead.",
    fit3: 'You want to feel radiant, feminine, and fully confident in your body.',
    fit4: "You're looking for a stress-relieving activity that feels like self-care.",
    fit5: 'You want to reconnect with your femininity and sensuality.',
    socialProof: 'Social proof',
    singlePlan: 'Single plan',
    courseTitle: 'Belly Dance Course',
    pricingSubtitle: 'Everything important in one offer.',
    fullAccess: 'full course access',
    discountEnds: 'Discount ends in:',
    list1: '10 short lessons',
    list2: 'Beginner-friendly format',
    list3: '12 months access',
    list4: 'Watch anywhere',
    faqTitle: 'Everything you may want to know.',
    faqSubtitle: 'Short answers to the most important questions before joining.',
    faq1q: 'I have no experience in dancing, will it suit me?',
    faq1a: "Absolutely! This program is created for complete beginners. Each step is explained slowly and clearly, so you'll feel confident from the very first lesson.",
    faq2q: "What if I don't have a beautiful costume or special training?",
    faq2a: "You don't need any costume or preparation. Just comfortable clothes you can move in. If you decide to dress up later - that's just a fun bonus!",
    faq3q: 'How much time will the lessons take?',
    faq3a: 'Each lesson is around 30-60 minutes. You can practice anytime, at your own pace.',
    faq4q: 'Will I have access to the lesson recordings after I complete all the sessions?',
    faq4a: "Yes! You'll have access to all lessons for one full year, so you can repeat and practice as much as you want.",
    faq5q: "What if I change my mind / don't like it?",
    faq5a: "No worries - we have a 7-day money-back guarantee. If you feel this program isn't for you, I'll refund your payment.",
    faq6q: 'What if I miss a day?',
    faq6a: 'No problem! You can always come back and continue from where you left off. The program is flexible for your lifestyle.',
    faq7q: "I feel shy about dancing, what if I can't do it?",
    faq7a: "That's the beauty of online learning - you dance in your own space, no pressure, no judgment. And you'll be surprised how quickly you start to feel graceful.",
    faq8q: 'What language is the program in?',
    faq8a: "All lessons are in simple English, perfectly clear for beginners. Even if English is not your native language, you'll easily understand everything. Subtitles will also be in Spanish.",
    faq9q: 'Am I too old to start dancing?',
    faq9a: "Not at all! Belly dance celebrates femininity at every age. Whether you're 20 or 60, it helps you reconnect with your body, move gracefully, and feel radiant from within.",
    faq10q: 'Will I really be able to dance after 10 lessons?',
    faq10a: "Yes! You'll learn step by step, and by the end you'll put everything together into a full dance choreography.",
    footerText: 'Clean lavender landing page concept with gold accents.',
    backToTop: 'Back to top ↑',
    pageTitle: 'Grace by Ekaterina - Belly Dance Course',
    pageDescription: 'Simple belly dance program for beginners. 10 short lessons, beautiful design, one clear offer for $39.'
  },
  es: {
    navBio: 'Biografia',
    navForYou: 'Para ti',
    navReviews: 'Resenas',
    navPrice: 'Precio',
    navFaq: 'Preguntas',
    menuTitle: 'Menu',
    joinNow: 'Unirme ahora',
    heroTitle: 'Olvidaste lo que se siente moverte y sentirte mujer.',
    heroQuote: 'En 10 lecciones con una campeona mundial, no solo aprenderas danza del vientre. Recuperaras esa sensacion. Para siempre.',
    discoverMore: 'Descubrir mas',
    startNow: 'Comenzar ahora',
    onePrice: 'Un precio claro',
    bioEyebrow: 'Biografia',
    bioText: 'Mi nombre es EKATERINA OLEINIKOVA. Soy dos veces campeona mundial de danza del vientre, jueza en competiciones internacionales en mas de 30 paises y profesora con 16 anos de experiencia. Pero lo mas importante es que he ensenado a miles de mujeres sin experiencia a bailar con confianza y belleza. Ahora es tu turno.',
    fitEyebrow: 'Ideal para ti',
    fitTitle: 'Este programa es para ti si...',
    fitSubtitle: 'Si estas frases te describen, este curso fue creado para tu camino.',
    fit1: 'Nunca has bailado antes, pero en secreto sonabas con moverte con gracia como una diosa.',
    fit2: 'Ya te cansaste de entrenamientos aburridos y quieres algo alegre, femenino y divertido.',
    fit3: 'Quieres sentirte radiante, femenina y totalmente segura en tu cuerpo.',
    fit4: 'Buscas una actividad que te quite el estres y se sienta como autocuidado.',
    fit5: 'Quieres reconectar con tu feminidad y sensualidad.',
    socialProof: 'Prueba social',
    singlePlan: 'Plan unico',
    courseTitle: 'Curso de Danza del Vientre',
    pricingSubtitle: 'Todo lo importante en una sola oferta.',
    fullAccess: 'acceso completo al curso',
    discountEnds: 'El descuento termina en:',
    list1: '10 lecciones cortas',
    list2: 'Formato para principiantes',
    list3: '12 meses de acceso',
    list4: 'Mira desde cualquier lugar',
    faqTitle: 'Todo lo que quieres saber.',
    faqSubtitle: 'Respuestas cortas a las preguntas mas importantes antes de unirte.',
    faq1q: 'No tengo experiencia bailando, me servira?',
    faq1a: 'Por supuesto. Este programa esta creado para principiantes totales. Cada paso se explica despacio y con claridad, para que te sientas segura desde la primera leccion.',
    faq2q: 'Y si no tengo un traje bonito o formacion especial?',
    faq2a: 'No necesitas traje ni preparacion. Solo ropa comoda para moverte. Si despues quieres arreglarte mas, sera solo un bonus divertido.',
    faq3q: 'Cuanto tiempo duran las lecciones?',
    faq3a: 'Cada leccion dura entre 30 y 60 minutos. Puedes practicar cuando quieras, a tu propio ritmo.',
    faq4q: 'Tendre acceso a las grabaciones despues de completar todas las sesiones?',
    faq4a: 'Si. Tendras acceso a todas las lecciones durante un ano completo para repetir y practicar todo lo que quieras.',
    faq5q: 'Y si cambio de opinion o no me gusta?',
    faq5a: 'No te preocupes, tenemos garantia de devolucion de 7 dias. Si sientes que este programa no es para ti, te devuelvo el pago.',
    faq6q: 'Que pasa si pierdo un dia?',
    faq6a: 'No pasa nada. Siempre puedes volver y continuar donde lo dejaste. El programa es flexible para tu estilo de vida.',
    faq7q: 'Me da verguenza bailar, y si no puedo hacerlo?',
    faq7a: 'Esa es la belleza del aprendizaje online: bailas en tu propio espacio, sin presion ni juicio. Te sorprendera lo rapido que empiezas a sentirte elegante.',
    faq8q: 'En que idioma esta el programa?',
    faq8a: 'Todas las lecciones estan en ingles simple, muy claro para principiantes. Aunque el ingles no sea tu idioma nativo, entenderas todo facilmente. Los subtitulos tambien estaran en espanol.',
    faq9q: 'Soy demasiado mayor para empezar a bailar?',
    faq9a: 'Para nada. La danza del vientre celebra la feminidad a cualquier edad. Tengas 20 o 60, te ayuda a reconectar con tu cuerpo, moverte con gracia y sentirte radiante por dentro.',
    faq10q: 'De verdad podre bailar despues de 10 lecciones?',
    faq10a: 'Si. Aprenderas paso a paso y al final uniras todo en una coreografia completa.',
    footerText: 'Concepto de landing lavanda con acentos dorados.',
    backToTop: 'Volver arriba ↑',
    pageTitle: 'Grace by Ekaterina - Curso de Danza del Vientre',
    pageDescription: 'Programa simple de danza del vientre para principiantes. 10 lecciones cortas, diseno elegante y una oferta clara por $39.'
  }
};

const applyLanguage = (lang) => {
  const active = translations[lang] ? lang : 'en';
  const dict = translations[active];

  document.documentElement.lang = active;
  document.title = dict.pageTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', dict.pageDescription);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang') === active);
  });

  localStorage.setItem(I18N_STORAGE_KEY, active);
};

const getLanguageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get('lang') || '').toLowerCase();
  return SUPPORTED_LANGS.includes(raw) ? raw : null;
};

const updateUrlLanguage = (lang) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());
};

const initLanguageSwitcher = () => {
  const urlLang = getLanguageFromUrl();
  const savedLang = (localStorage.getItem(I18N_STORAGE_KEY) || '').toLowerCase();
  const initialLang = urlLang || (SUPPORTED_LANGS.includes(savedLang) ? savedLang : 'en');

  applyLanguage(initialLang);
  updateUrlLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') || 'en';
      applyLanguage(lang);
      updateUrlLanguage(lang);
    });
  });
};

initLanguageSwitcher();
initBurgerMenu();
