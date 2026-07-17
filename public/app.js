(() => {
  "use strict";

  const localeVersion = "1.3.1";
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
      htmlLang: "zh-CN",
      code: "简",
      native: "简体中文",
      english: "Simplified Chinese",
      dir: "ltr",
    },
    {
      id: "zh-TW",
      htmlLang: "zh-Hant",
      code: "繁",
      native: "繁體中文",
      english: "Traditional Chinese",
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
  const languageTrigger = document.getElementById("languageTrigger");
  const languageDialog = document.getElementById("languageDialog");
  const closeLanguageButton = document.getElementById("closeLanguage");
  const languageList = document.getElementById("languageList");
  const languageCode = document.getElementById("languageCode");
  const copyButton = document.getElementById("copyButton");
  const toast = document.getElementById("toast");
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const openGraphDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  const dialogPeers = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer"),
  ].filter(Boolean);

  const englishFallback = captureEnglishFallback();
  const localeCache = new Map([["en", englishFallback]]);
  let lastFocusedElement = null;
  let toastTimer = 0;
  let localeRequestId = 0;
  let currentLocale = resolvePreferredLocale();

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
      languageTrigger.setAttribute(
        "aria-label",
        `${messages.language}: ${localeData.native}`,
      );
      descriptionMeta.content = messages.meta;
      openGraphDescription.content = messages.meta;
      closeLanguageButton.setAttribute("aria-label", messages.close);
      document.querySelectorAll(".linkedin-cta").forEach((link) => {
        link.setAttribute(
          "aria-label",
          `${messages.viewLinkedin}: Jeremy Ying`,
        );
      });
      formatDateRanges(messages);
      renderLanguageOptions();
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

  function openLanguageDialog() {
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
        ".section-intro, .focus-item, .timeline-item, .highlight-item, .credential-list li, .connect-layout",
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
    if (languageDialog.hidden) return;
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
  });
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("https://jmying.com");
      showToast((localeCache.get(currentLocale) || englishFallback).copied);
    } catch {
      showToast("jmying.com");
    }
  });
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer external";
    link.referrerPolicy = "no-referrer";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  renderLanguageOptions();
  applyLocale(currentLocale);
  setupNavigationTracking();
  setupPurposefulMotion();
})();
