(() => {
  "use strict";

  const localeVersion = "1.10.1";
  const localeManifest = [
    {
      id: "en",
      htmlLang: "en",
      code: "EN",
      native: "English",
      english: "English",
      dir: "ltr",
    },
    {
      id: "zh-CN",
      htmlLang: "zh-Hans",
      code: "简",
      native: "简体中文",
      english: "Chinese (Simplified)",
      dir: "ltr",
    },
    {
      id: "zh-TW",
      htmlLang: "zh-Hant",
      code: "繁",
      native: "繁體中文",
      english: "Chinese (Traditional)",
      dir: "ltr",
    },
    {
      id: "ms",
      htmlLang: "ms",
      code: "MS",
      native: "Bahasa Melayu",
      english: "Malay",
      dir: "ltr",
    },
    {
      id: "id",
      htmlLang: "id",
      code: "ID",
      native: "Bahasa Indonesia",
      english: "Indonesian",
      dir: "ltr",
    },
    {
      id: "th",
      htmlLang: "th",
      code: "ไทย",
      native: "ไทย",
      english: "Thai",
      dir: "ltr",
    },
    {
      id: "vi",
      htmlLang: "vi",
      code: "VI",
      native: "Tiếng Việt",
      english: "Vietnamese",
      dir: "ltr",
    },
    {
      id: "ja",
      htmlLang: "ja",
      code: "日",
      native: "日本語",
      english: "Japanese",
      dir: "ltr",
    },
    {
      id: "ko",
      htmlLang: "ko",
      code: "한",
      native: "한국어",
      english: "Korean",
      dir: "ltr",
    },
    {
      id: "fr",
      htmlLang: "fr",
      code: "FR",
      native: "Français",
      english: "French",
      dir: "ltr",
    },
    {
      id: "de",
      htmlLang: "de",
      code: "DE",
      native: "Deutsch",
      english: "German",
      dir: "ltr",
    },
    {
      id: "es",
      htmlLang: "es",
      code: "ES",
      native: "Español",
      english: "Spanish",
      dir: "ltr",
    },
    {
      id: "pt-BR",
      htmlLang: "pt-BR",
      code: "PT",
      native: "Português (Brasil)",
      english: "Portuguese (Brazil)",
      dir: "ltr",
    },
    {
      id: "ar",
      htmlLang: "ar",
      code: "ع",
      native: "العربية",
      english: "Arabic",
      dir: "rtl",
    },
  ];
  const localeById = new Map(
    localeManifest.map((locale) => [locale.id, locale]),
  );
  const translatableNodes = [...document.querySelectorAll("[data-i18n]")];
  const siteHeader = document.querySelector(".site-header");
  const primaryNav = document.getElementById("primaryNav");
  const menuTrigger = document.getElementById("menuTrigger");
  const mobileMenuQuery = window.matchMedia("(max-width: 820px)");
  const languageTrigger = document.getElementById("languageTrigger");
  const languageDialog = document.getElementById("languageDialog");
  const closeLanguageButton = document.getElementById("closeLanguage");
  const languageList = document.getElementById("languageList");
  const languageCode = document.getElementById("languageCode");
  const copyButton = document.getElementById("copyButton");
  const toast = document.getElementById("toast");
  const evidenceFilterButtons = [
    ...document.querySelectorAll("[data-evidence-filter]"),
  ];
  const evidenceItems = [...document.querySelectorAll("[data-evidence-item]")];
  const evidenceDetailCategory = document.querySelector(
    "[data-evidence-detail-category]",
  );
  const evidenceDetailRole = document.querySelector(
    "[data-evidence-detail-role]",
  );
  const evidenceDetailDate = document.querySelector(
    "[data-evidence-detail-date]",
  );
  const evidenceDetailOrganization = document.querySelector(
    "[data-evidence-detail-organization]",
  );
  const evidenceDetailDescription = document.querySelector(
    "[data-evidence-detail-description]",
  );
  const highlightTrack = document.getElementById("highlightTrack");
  const previousHighlightButton = document.querySelector(
    "[data-highlight-previous]",
  );
  const nextHighlightButton = document.querySelector("[data-highlight-next]");
  const highlightDialog = document.getElementById("highlightDialog");
  const closeHighlightButton = document.getElementById("closeHighlight");
  const highlightDialogMeta = document.getElementById("highlightDialogMeta");
  const highlightDialogTitle = document.getElementById("highlightDialogTitle");
  const highlightDialogLabel = document.getElementById("highlightDialogLabel");
  const highlightDialogDescription = document.getElementById(
    "highlightDialogDescription",
  );
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const openGraphDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  const dialogPeers = [
    siteHeader,
    document.querySelector("main"),
    document.querySelector(".site-footer"),
  ].filter(Boolean);

  const englishFallback = captureEnglishFallback();
  const localeCache = new Map([["en", englishFallback]]);
  let lastFocusedElement = null;
  let toastTimer = 0;
  let localeRequestId = 0;
  let currentLocale = resolvePreferredLocale();
  let carouselIndex = 0;
  let carouselFrame = 0;
  let activeHighlightCard = null;
  let lastHighlightTrigger = null;
  let activeEvidenceItem =
    evidenceItems.find(
      (item) => item.getAttribute("aria-pressed") === "true",
    ) ||
    evidenceItems[0] ||
    null;

  function captureEnglishFallback() {
    const messages = Object.create(null);
    translatableNodes.forEach((node) => {
      const key = node.dataset.i18n;
      if (!(key in messages))
        messages[key] = node.textContent.trim().replace(/\s+/g, " ");
    });
    return {
      ...messages,
      htmlLang: "en",
      code: "EN",
      native: "English",
      english: "English",
      meta: descriptionMeta.content,
      copied: "Link copied",
      present: "Present",
      highlightsCarouselLabel:
        highlightTrack?.getAttribute("aria-label") ||
        "Selected projects carousel",
    };
  }

  function readStoredLocale() {
    try {
      return localStorage.getItem("jmying-language");
    } catch {
      return null;
    }
  }

  function storeLocale(locale) {
    try {
      localStorage.setItem("jmying-language", locale);
    } catch {}
  }

  function normalizeLocale(locale) {
    const normalized = String(locale || "")
      .replaceAll("_", "-")
      .toLowerCase();
    if (!normalized) return null;

    if (
      normalized.startsWith("zh-hant") ||
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") ||
      normalized.startsWith("zh-mo")
    ) {
      return "zh-TW";
    }
    if (normalized.startsWith("zh")) return "zh-CN";

    const exactMatch = localeManifest.find(
      (candidate) => candidate.id.toLowerCase() === normalized,
    );
    if (exactMatch) return exactMatch.id;

    const baseLanguage = normalized.split("-")[0];
    return (
      localeManifest.find(
        (candidate) =>
          candidate.id.split("-")[0].toLowerCase() === baseLanguage,
      )?.id || null
    );
  }

  function resolvePreferredLocale() {
    const storedLocale = normalizeLocale(readStoredLocale());
    if (storedLocale) return storedLocale;

    const browserLocales = navigator.languages || [navigator.language || "en"];
    for (const browserLocale of browserLocales) {
      const supportedLocale = normalizeLocale(browserLocale);
      if (supportedLocale) return supportedLocale;
    }
    return "en";
  }

  async function loadLocale(locale) {
    if (localeCache.has(locale)) return localeCache.get(locale);

    const response = await fetch(
      `/locales/${encodeURIComponent(locale)}.json?v=${localeVersion}`,
      { credentials: "same-origin" },
    );
    if (!response.ok)
      throw new Error(`Locale request failed: ${response.status}`);

    const messages = await response.json();
    localeCache.set(locale, messages);
    return messages;
  }

  function localizedLanguageName(locale) {
    try {
      const displayNames = new Intl.DisplayNames(
        [localeById.get(currentLocale).htmlLang],
        {
          type: "language",
        },
      );
      return displayNames.of(locale.htmlLang);
    } catch {
      return locale.english;
    }
  }

  function renderLanguageOptions() {
    if (!languageList.childElementCount) {
      const fragment = document.createDocumentFragment();
      localeManifest.forEach((locale) => {
        const option = document.createElement("button");
        option.className = "language-option";
        option.type = "button";
        option.dataset.language = locale.id;

        const nativeName = document.createElement("span");
        nativeName.className = "native-name";
        nativeName.lang = locale.htmlLang;
        nativeName.dir = locale.dir;
        nativeName.textContent = locale.native;

        const localizedName = document.createElement("span");
        localizedName.className = "localized-name";
        option.append(nativeName, localizedName);
        fragment.append(option);
      });
      languageList.append(fragment);
    }

    languageList.querySelectorAll("[data-language]").forEach((option) => {
      const locale = localeById.get(option.dataset.language);
      const secondaryLabel = option.querySelector(".localized-name");
      const localizedName = localizedLanguageName(locale);
      option.setAttribute("aria-current", String(locale.id === currentLocale));
      option.setAttribute("aria-label", `${locale.native} — ${localizedName}`);
      secondaryLabel.textContent = localizedName;
    });
  }

  function formatDateRanges(messages) {
    const locale = localeById.get(currentLocale).htmlLang;
    const monthFormatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    const yearFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      timeZone: "UTC",
    });

    document.querySelectorAll("[data-date-start]").forEach((time) => {
      const startValue = time.dataset.dateStart;
      const endValue = time.dataset.dateEnd;
      const startDate = parseDate(startValue);
      if (endValue === "present") {
        time.textContent = `${yearFormatter.format(startDate)} – ${messages.present}`;
        return;
      }

      const endDate = parseDate(endValue);
      time.textContent =
        typeof monthFormatter.formatRange === "function"
          ? monthFormatter.formatRange(startDate, endDate)
          : `${monthFormatter.format(startDate)} – ${monthFormatter.format(endDate)}`;
    });
  }

  function parseDate(value) {
    const [year, month = "1"] = value.split("-");
    return new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  }

  async function applyLocale(locale, { persist = false } = {}) {
    const normalizedLocale = normalizeLocale(locale) || "en";
    const requestId = ++localeRequestId;
    document.documentElement.setAttribute("aria-busy", "true");
    languageTrigger.disabled = true;

    try {
      const messages = await loadLocale(normalizedLocale);
      if (requestId !== localeRequestId) return false;

      currentLocale = normalizedLocale;
      const localeData = localeById.get(currentLocale);
      document.documentElement.lang = messages.htmlLang || localeData.htmlLang;
      document.documentElement.dir = localeData.dir;

      translatableNodes.forEach((node) => {
        const translatedText = messages[node.dataset.i18n];
        if (translatedText) node.textContent = translatedText;
      });
      languageCode.textContent = localeData.code;
      descriptionMeta.content = messages.meta;
      openGraphDescription.content = messages.meta;
      closeLanguageButton.setAttribute("aria-label", messages.close);
      highlightTrack?.setAttribute(
        "aria-label",
        messages.highlightsCarouselLabel,
      );
      document.querySelectorAll(".linkedin-cta").forEach((link) => {
        link.setAttribute(
          "aria-label",
          `${messages.viewLinkedin}: Jeremy Ying`,
        );
      });
      formatDateRanges(messages);
      renderEvidenceDetail(activeEvidenceItem, messages);
      renderLanguageOptions();
      if (activeHighlightCard) renderHighlightDialog(activeHighlightCard);
      window.requestAnimationFrame(() =>
        scrollToHighlight(carouselIndex, "auto"),
      );
      if (persist) storeLocale(currentLocale);
      return true;
    } catch {
      showToast("Could not load this language.");
      return false;
    } finally {
      if (requestId === localeRequestId) {
        document.documentElement.removeAttribute("aria-busy");
        languageTrigger.disabled = false;
      }
    }
  }

  function setDialogPeersInert(inert) {
    dialogPeers.forEach((element) => {
      element.inert = inert;
    });
  }

  function mobileMenuIsOpen() {
    return siteHeader?.dataset.menuOpen === "true";
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!siteHeader || !menuTrigger) return;
    siteHeader.removeAttribute("data-menu-open");
    menuTrigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuTrigger.focus();
  }

  function openMobileMenu() {
    if (!siteHeader || !menuTrigger || !mobileMenuQuery.matches) return;
    siteHeader.dataset.menuOpen = "true";
    menuTrigger.setAttribute("aria-expanded", "true");
  }

  function toggleMobileMenu() {
    if (mobileMenuIsOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openLanguageDialog() {
    closeMobileMenu();
    lastFocusedElement = document.activeElement;
    languageDialog.hidden = false;
    languageTrigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("dialog-open");
    setDialogPeersInert(true);
    closeLanguageButton.focus();
  }

  function closeLanguageDialog() {
    languageDialog.hidden = true;
    languageTrigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("dialog-open");
    setDialogPeersInert(false);
    lastFocusedElement?.focus?.();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function highlightCards() {
    return highlightTrack
      ? [...highlightTrack.querySelectorAll(".highlight-card")]
      : [];
  }

  function updateHighlightControls() {
    const cards = highlightCards();
    if (!cards.length) return;
    const maxScroll = Math.max(
      0,
      highlightTrack.scrollWidth - highlightTrack.clientWidth,
    );
    const logicalScroll =
      document.documentElement.dir === "rtl"
        ? Math.abs(highlightTrack.scrollLeft)
        : highlightTrack.scrollLeft;
    previousHighlightButton.disabled = logicalScroll <= 1;
    nextHighlightButton.disabled = logicalScroll >= maxScroll - 1;
  }

  function scrollByHighlight(direction) {
    const cards = highlightCards();
    if (!cards.length) return;
    const trackStyles = window.getComputedStyle(highlightTrack);
    const gap = Number.parseFloat(trackStyles.columnGap) || 0;
    const distance = cards[0].getBoundingClientRect().width + gap;
    const rtlMultiplier = document.documentElement.dir === "rtl" ? -1 : 1;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    highlightTrack.scrollBy({
      left: direction * distance * rtlMultiplier,
      behavior,
    });
  }

  function scrollToHighlight(index, requestedBehavior) {
    const cards = highlightCards();
    if (!cards.length) return;
    carouselIndex = Math.max(0, Math.min(index, cards.length - 1));
    const behavior =
      requestedBehavior ||
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth");
    const direction = document.documentElement.dir;
    const trackRect = highlightTrack.getBoundingClientRect();
    const cardRect = cards[carouselIndex].getBoundingClientRect();
    const trackStyles = window.getComputedStyle(highlightTrack);
    const startInset = Number.parseFloat(
      direction === "rtl" ? trackStyles.paddingRight : trackStyles.paddingLeft,
    );
    const targetEdge =
      direction === "rtl"
        ? trackRect.right - startInset
        : trackRect.left + startInset;
    const cardEdge = direction === "rtl" ? cardRect.right : cardRect.left;
    highlightTrack.scrollTo({
      left: highlightTrack.scrollLeft + cardEdge - targetEdge,
      behavior,
    });
    updateHighlightControls();
    window.requestAnimationFrame(updateHighlightIndexFromScroll);
  }

  function updateHighlightIndexFromScroll() {
    carouselFrame = 0;
    const cards = highlightCards();
    if (!cards.length) return;

    const direction = document.documentElement.dir;
    const trackRect = highlightTrack.getBoundingClientRect();
    const trackStyles = window.getComputedStyle(highlightTrack);
    const startInset = Number.parseFloat(
      direction === "rtl" ? trackStyles.paddingRight : trackStyles.paddingLeft,
    );
    const targetEdge =
      direction === "rtl"
        ? trackRect.right - startInset
        : trackRect.left + startInset;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardEdge = direction === "rtl" ? cardRect.right : cardRect.left;
      const distance = Math.abs(cardEdge - targetEdge);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    carouselIndex = closestIndex;
    updateHighlightControls();
  }

  function requestHighlightIndexUpdate() {
    if (carouselFrame) return;
    carouselFrame = window.requestAnimationFrame(
      updateHighlightIndexFromScroll,
    );
  }

  function renderHighlightDialog(card) {
    if (!card) return;
    const index = card.querySelector(".highlight-index")?.textContent.trim();
    const year = card.querySelector(".highlight-year")?.textContent.trim();
    highlightDialogMeta.textContent = [index, year].filter(Boolean).join(" · ");
    highlightDialogTitle.textContent = card
      .querySelector(".highlight-card-title")
      ?.textContent.trim();
    highlightDialogLabel.textContent = card
      .querySelector(".highlight-label")
      ?.textContent.trim();
    highlightDialogDescription.textContent = card
      .querySelector(".highlight-description")
      ?.textContent.trim();
  }

  function openHighlightDialog(trigger) {
    const card = trigger.closest(".highlight-card");
    if (!card || !highlightDialog) return;
    activeHighlightCard = card;
    lastHighlightTrigger = trigger;
    renderHighlightDialog(card);
    document.body.classList.add("dialog-open");
    highlightDialog.showModal();
    closeHighlightButton.focus();
  }

  function closeHighlightDialog() {
    if (highlightDialog?.open) highlightDialog.close();
  }

  function setupHighlightCarousel() {
    if (!highlightTrack) return;
    updateHighlightControls();
    previousHighlightButton.addEventListener("click", () => {
      scrollByHighlight(-1);
    });
    nextHighlightButton.addEventListener("click", () => {
      scrollByHighlight(1);
    });
    highlightTrack.addEventListener("scroll", requestHighlightIndexUpdate, {
      passive: true,
    });
    highlightTrack.addEventListener("keydown", (event) => {
      if (event.target !== highlightTrack) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const rtl = document.documentElement.dir === "rtl";
      const forward = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
      scrollByHighlight(forward ? 1 : -1);
    });
    window.addEventListener("resize", requestHighlightIndexUpdate, {
      passive: true,
    });
  }

  function renderEvidenceDetail(
    item,
    messages = localeCache.get(currentLocale) || englishFallback,
  ) {
    if (!item || !evidenceDetailRole) return;
    const categoryKey =
      item.dataset.category === "education"
        ? "evidenceFilterEducation"
        : "evidenceFilterExperience";
    evidenceDetailCategory.textContent = messages[categoryKey];
    evidenceDetailRole.textContent = messages[item.dataset.roleKey];
    evidenceDetailDate.textContent =
      item.querySelector("time")?.textContent || "";
    evidenceDetailOrganization.textContent = item.dataset.organization;
    evidenceDetailDescription.textContent =
      messages[item.dataset.descriptionKey];
  }

  function selectEvidenceItem(item, { focus = false } = {}) {
    if (!item || item.hidden) return;
    activeEvidenceItem = item;
    evidenceItems.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === item));
    });
    renderEvidenceDetail(item);
    if (focus) item.focus();
  }

  function applyEvidenceFilter(filter) {
    evidenceFilterButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.evidenceFilter === filter),
      );
    });
    evidenceItems.forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
    if (activeEvidenceItem?.hidden) {
      selectEvidenceItem(evidenceItems.find((item) => !item.hidden));
    }
  }

  function setupEvidenceExplorer() {
    evidenceFilterButtons.forEach((button) => {
      button.addEventListener("click", () =>
        applyEvidenceFilter(button.dataset.evidenceFilter),
      );
    });
    evidenceItems.forEach((item) => {
      item.addEventListener("click", () => selectEvidenceItem(item));
    });
    selectEvidenceItem(activeEvidenceItem);
  }

  function setupNavigationTracking() {
    const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
    const sections = navigationLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          )[0];
        if (!activeEntry) return;

        navigationLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${activeEntry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.01, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
  }

  function setupPurposefulMotion() {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const revealTargets = [
      ...document.querySelectorAll(
        ".section-intro, .focus-item, .timeline-item, .evidence-explorer, .approach-visual, .approach-list li, .toolkit-strip, .highlight-card, .credential-list li, .connect-layout",
      ),
    ];
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    revealTargets.forEach((target) => {
      target.dataset.reveal = "";
      observer.observe(target);
    });
  }

  menuTrigger?.addEventListener("click", toggleMobileMenu);
  primaryNav?.addEventListener("click", (event) => {
    if (event.target.closest("[data-nav-link]")) closeMobileMenu();
  });
  mobileMenuQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMobileMenu();
  });
  document.addEventListener("pointerdown", (event) => {
    if (mobileMenuIsOpen() && !siteHeader.contains(event.target)) {
      closeMobileMenu();
    }
  });
  languageTrigger.addEventListener("click", openLanguageDialog);
  closeLanguageButton.addEventListener("click", closeLanguageDialog);
  languageDialog.addEventListener("click", (event) => {
    if (event.target === languageDialog) closeLanguageDialog();
  });
  languageList.addEventListener("click", async (event) => {
    const option = event.target.closest("[data-language]");
    if (!option) return;
    const applied = await applyLocale(option.dataset.language, {
      persist: true,
    });
    if (applied) closeLanguageDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && highlightDialog?.open) {
      closeHighlightDialog();
      return;
    }
    if (!languageDialog.hidden) {
      if (event.key === "Escape") {
        closeLanguageDialog();
        return;
      }
      if (event.key !== "Tab") return;

      const focusableButtons = [
        ...languageDialog.querySelectorAll("button:not([disabled])"),
      ];
      if (!focusableButtons.length) return;
      const firstButton = focusableButtons[0];
      const lastButton = focusableButtons[focusableButtons.length - 1];
      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault();
        lastButton.focus();
      } else if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault();
        firstButton.focus();
      }
      return;
    }
    if (event.key === "Escape" && mobileMenuIsOpen()) {
      closeMobileMenu({ restoreFocus: true });
    }
  });
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("https://jmying.com");
      showToast((localeCache.get(currentLocale) || englishFallback).copied);
    } catch {
      showToast("jmying.com");
    }
  });
  document.querySelectorAll("[data-highlight-learn]").forEach((button) => {
    button.addEventListener("click", () => openHighlightDialog(button));
  });
  closeHighlightButton?.addEventListener("click", closeHighlightDialog);
  highlightDialog?.addEventListener("click", (event) => {
    if (event.target === highlightDialog) closeHighlightDialog();
  });
  highlightDialog?.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    activeHighlightCard = null;
    lastHighlightTrigger?.focus?.();
    lastHighlightTrigger = null;
  });
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer external";
    link.referrerPolicy = "no-referrer";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  renderLanguageOptions();
  setupEvidenceExplorer();
  applyLocale(currentLocale);
  setupNavigationTracking();
  setupHighlightCarousel();
  setupPurposefulMotion();
})();
