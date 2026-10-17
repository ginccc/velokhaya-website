import type * as AmplitudeSDK from '@amplitude/analytics-browser';

declare global {
    interface Window {
        showCookieBanner?: () => void;
    }
}

const AMPLITUDE_API_KEY = 'c76c4b9a7b26cdce0dc37da28e6a80c9';
let amplitude: typeof AmplitudeSDK | undefined;

// The official SDK is bundled as its own chunk and only downloaded after consent. It does not include
// session replay (a separate package this site does not install), so nothing is ever recorded.
async function loadAmplitude() {
    amplitude = await import('@amplitude/analytics-browser');
    amplitude.init(AMPLITUDE_API_KEY, {
        serverZone: 'EU',
        fetchRemoteConfig: true,
        autocapture: {
            attribution: true,
            fileDownloads: true,
            formInteractions: true,
            pageViews: true,
            sessions: true,
            elementInteractions: true,
            networkTracking: true,
            webVitals: true,
            frustrationInteractions: true,
        },
    });
}

const STORAGE_KEY = 'cookie_consent';
let trackingLoaded = false;

// Storage can throw when the browser blocks site data; the choice then lasts for this page view only.
function readConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
}

function writeConsent(value: 'accepted' | 'essential') {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* see readConsent */ }
}

function enableTracking() {
    if (trackingLoaded) return;
    trackingLoaded = true;
    loadAmplitude();
    window.dispatchEvent(new CustomEvent('cookie-consent-given'));
}

// Delete everything Amplitude stores in the browser. Runs on page load whenever consent is not
// "accepted", i.e. before any SDK code exists on the page, so nothing can rewrite it afterwards.
function purgeAnalyticsStorage() {
    const hostParts = location.hostname.split('.');
    document.cookie.split(';').forEach(function (cookie) {
        const name = cookie.split('=')[0].trim();
        if (name.indexOf('AMP') !== 0) return;
        document.cookie = name + '=; Max-Age=0; path=/';
        // Amplitude may scope its cookie to a parent domain, so clear every level of the hostname.
        for (let i = 0; i < hostParts.length - 1; i++) {
            document.cookie = name + '=; Max-Age=0; path=/; domain=.' + hostParts.slice(i).join('.');
        }
    });
    try {
        Object.keys(localStorage).forEach(function (key) {
            if (key.indexOf('AMP') === 0) localStorage.removeItem(key);
        });
    } catch (e) { /* storage blocked: nothing was stored there */ }
}

// Withdrawing consent has to take effect immediately: stop the SDK sending, then reload. The SDK
// still writes to storage while it is shutting down, so the clean-up happens on the reloaded page
// (see purgeAnalyticsStorage), where the SDK is no longer loaded.
function withdrawTracking() {
    try {
        amplitude?.setOptOut(true);
    } catch (e) { /* SDK not ready; the reload stops it anyway */ }
    location.reload();
}

// The banner is a non-blocking card: no overlay, no scroll lock, no inert page. Nothing is tracked until
// the visitor accepts, so there is no reason to block reading, and browsers that hide consent notices
// (e.g. Brave) would otherwise leave visitors with a frozen page. Focus only moves into the banner when
// the visitor opened it themselves (footer "Cookie Preferences"), never on page load.
function showBanner(userInitiated = false) {
    // Check if banner already exists
    if (document.getElementById('cookie-consent-banner')) return;

    const opener = userInitiated ? (document.activeElement as HTMLElement | null) : null;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'cookie-consent-title');
    // Custom classes (bg-white-10, border-white-10, ...) are defined in cookie-consent.css
    banner.className = 'fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[26rem] max-h-[85vh] overflow-y-auto z-[9999] bg-brand-dark text-white p-5 rounded-2xl shadow-2xl border border-white-10';

    // Content for the initial view: compact, so it covers as little of a phone screen as possible.
    // "Accept All" and "Essential Only" are the same size, side by side: declining is as easy as accepting.
    const initialContent = `
        <div>
            <h2 id="cookie-consent-title" class="text-base font-bold font-heading text-white mb-1">We value your privacy</h2>
            <p class="text-gray-400 mb-4 text-sm leading-relaxed">
                We use analytics cookies to understand how this site is used and to improve it.
                They are only set with your consent. Read our
                <a href="/privacy-policy/" class="underline text-gray-300 hover-text-accent">Privacy Policy</a>.
            </p>
            <div class="grid grid-cols-2 gap-2">
                <button type="button" id="cookie-accept-all" class="w-full px-3 py-2.5 bg-accent hover-brightness-105 text-white rounded-lg text-sm font-bold transition-all cursor-pointer">
                    Accept All
                </button>
                <button type="button" id="cookie-essential-only" class="w-full px-3 py-2.5 bg-brand-black border border-white-10 hover-bg-brand-gray text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    Essential Only
                </button>
            </div>
            <button type="button" id="cookie-manage" class="mt-1 w-full py-2.5 text-center text-sm text-gray-400 underline underline-offset-4 hover-text-accent cursor-pointer">
                Manage Preferences
            </button>
        </div>
    `;

    // Content for the preferences view
    const preferencesContent = `
        <div>
            <div class="flex justify-between items-center mb-6">
                <h2 id="cookie-consent-title" class="text-lg font-bold font-heading text-white">Cookie Preferences</h2>
                <button type="button" id="cookie-back" aria-label="Back" class="text-gray-400 hover-text-accent transition-colors cursor-pointer">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                <label class="flex items-start justify-between gap-4 p-3 bg-brand-black rounded-lg border border-white-10">
                    <span>
                        <span class="block font-semibold text-sm text-white">Essential</span>
                        <span class="block text-xs text-gray-400 mt-1">Required for the website to function.</span>
                    </span>
                    <input type="checkbox" checked disabled class="mt-1 h-4 w-4 accent-brand-red rounded">
                </label>
                <label for="toggle-analytics" class="flex items-start justify-between gap-4 p-3 bg-brand-black rounded-lg border border-white-10 cursor-pointer">
                    <span>
                        <span class="block font-semibold text-sm text-white">Analytics</span>
                        <span class="block text-xs text-gray-400 mt-1">Help us understand how you use our site.</span>
                    </span>
                    <input type="checkbox" id="toggle-analytics" class="mt-1 h-4 w-4 accent-brand-red rounded cursor-pointer">
                </label>
            </div>
            <div class="flex flex-col space-y-3">
                <button type="button" id="cookie-save" class="w-full px-4 py-3 bg-accent hover-opacity-90 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    Save Preferences
                </button>
                <button type="button" id="cookie-accept-all-prefs" class="w-full px-4 py-3 bg-accent hover-brightness-105 text-white rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer">
                    Accept All
                </button>
            </div>
        </div>
    `;

    banner.innerHTML = initialContent;
    document.body.appendChild(banner);

    function focusFirstControl() {
        const first = banner.querySelector<HTMLElement>('button, input:not([disabled]), a[href]');
        if (first) first.focus();
    }

    function closeBanner() {
        banner.remove();
        if (opener && opener !== document.body && document.contains(opener)) opener.focus();
    }

    function applyChoice(analyticsEnabled: boolean) {
        const wasTracking = trackingLoaded;
        writeConsent(analyticsEnabled ? 'accepted' : 'essential');
        closeBanner();
        if (analyticsEnabled) {
            enableTracking();
        } else if (wasTracking) {
            withdrawTracking();
        }
    }

    // Event Delegation or re-attaching listeners
    function attachInitialListeners() {
        document.getElementById('cookie-accept-all')!.addEventListener('click', function () { applyChoice(true); });
        document.getElementById('cookie-essential-only')!.addEventListener('click', function () { applyChoice(false); });
        document.getElementById('cookie-manage')!.addEventListener('click', function () {
            banner.innerHTML = preferencesContent;
            attachPreferencesListeners();
            focusFirstControl();
        });
    }

    function attachPreferencesListeners() {
        // Reflect the stored choice when reopening the banner
        (document.getElementById('toggle-analytics') as HTMLInputElement).checked = readConsent() === 'accepted';

        document.getElementById('cookie-back')!.addEventListener('click', function () {
            banner.innerHTML = initialContent;
            attachInitialListeners();
            focusFirstControl();
        });

        document.getElementById('cookie-accept-all-prefs')!.addEventListener('click', function () { applyChoice(true); });

        document.getElementById('cookie-save')!.addEventListener('click', function () {
            applyChoice((document.getElementById('toggle-analytics') as HTMLInputElement).checked);
        });
    }

    attachInitialListeners();
    if (userInitiated) focusFirstControl();
}

// Always available so the footer "Cookie Preferences" button can reopen the banner
window.showCookieBanner = function () { showBanner(true); };

function bindSettingsButton() {
    const btn = document.getElementById('cookie-settings-btn');
    if (btn) btn.addEventListener('click', function () { showBanner(true); });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSettingsButton);
} else {
    bindSettingsButton();
}

const consent = readConsent();
if (consent === 'accepted') {
    enableTracking();
} else {
    purgeAnalyticsStorage();
}

if (consent !== 'accepted' && consent !== 'essential') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { showBanner(); });
    } else {
        showBanner();
    }
}
