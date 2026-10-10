(() => {
    const storageKey = "works-by-nrfz-theme";
    const validPreferences = ["system", "light", "dark"];
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
    const storedPreference = localStorage.getItem(storageKey);
    const mainPageUrl = new URL("../index.html", document.currentScript.src).href;
    let preference = validPreferences.includes(storedPreference) ? storedPreference : "system";

    const themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = new URL("theme.css", document.currentScript.src).href;
    document.head.append(themeStylesheet);

    const applyTheme = () => {
        const theme = preference === "system"
            ? (systemPreference.matches ? "dark" : "light")
            : preference;

        document.documentElement.dataset.theme = theme;

        const button = document.querySelector(".theme-toggle");
        if (button) {
            const nextPreference = validPreferences[(validPreferences.indexOf(preference) + 1) % validPreferences.length];
            const icons = {
                system: '<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8m-4-4v4"></path>',
                light: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>',
                dark: '<path d="M20.8 14.1A8.5 8.5 0 0 1 9.9 3.2 8.5 8.5 0 1 0 20.8 14.1Z"></path>'
            };
            const labels = {
                system: "Follow system",
                light: "Light",
                dark: "Dark"
            };
            const label = `Theme: ${labels[preference]}. Activate to switch to ${labels[nextPreference]}.`;

            button.setAttribute("aria-label", label);
            button.title = label;
            button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[preference]}</svg>`;
        }
    };

    const addThemeControl = () => {
        const header = document.querySelector("header");
        const host = document.querySelector(".site-header .nav")
            || header?.querySelector(".actions")
            || header?.querySelector(".top-inner")
            || (header && !header.querySelector("p") ? header : null)
            || document.querySelector(".nav");

        if (!host) {
            throw new Error("Could not find a header area for the theme selector.");
        }

        const control = document.createElement("div");
        control.className = "theme-control";
        if (!document.querySelector(".project-grid")) {
            const homeLink = document.createElement("a");
            homeLink.className = "home-link";
            homeLink.href = mainPageUrl;
            homeLink.setAttribute("aria-label", "Back to projects");
            homeLink.title = "Back to projects";
            homeLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7"></path><path d="M5 9v11h14V9M9 20v-7h6v7"></path></svg>';
            control.append(homeLink);
        }

        const themeButton = document.createElement("button");
        themeButton.type = "button";
        themeButton.className = "theme-toggle";
        themeButton.addEventListener("click", () => {
            preference = validPreferences[(validPreferences.indexOf(preference) + 1) % validPreferences.length];
            localStorage.setItem(storageKey, preference);
            applyTheme();
        });
        control.append(themeButton);

        host.append(control);
        host.classList.add("theme-control-host");
        applyTheme();

        if (host === header) {
            header.classList.add("has-theme-control");
        }

        if (host.classList.contains("actions")) {
            header.classList.add("theme-control-header");
        }
    };

    systemPreference.addEventListener("change", () => {
        if (preference === "system") {
            applyTheme();
        }
    });

    window.addEventListener("storage", event => {
        if (event.key === storageKey) {
            preference = validPreferences.includes(event.newValue) ? event.newValue : "system";
            applyTheme();
        }
    });

    applyTheme();
    document.addEventListener("DOMContentLoaded", addThemeControl, { once: true });
})();
