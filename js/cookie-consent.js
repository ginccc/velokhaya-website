(function() {
    const AMPLITUDE_API_KEY = 'c76c4b9a7b26cdce0dc37da28e6a80c9';

    function loadAmplitude() {
        // Amplitude
        (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
        ;r.type="text/javascript"
        ;r.integrity="sha384-YdqHVjD6IoVXU65w0u3YTeRI6MZgyc0xeXkXyGAlWBzbX+1qLD4qmayzcEF1RRLT"
        ;r.crossOrigin="anonymous";r.async=true
        ;r.src="https://cdn.eu.amplitude.com/script/c76c4b9a7b26cdce0dc37da28e6a80c9.js"
        ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
        console.log("[Amplitude] Error: could not load SDK")}}
        ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
        ;function s(e,t){e.prototype[t]=function(){
        this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
        var o=function(){this._q=[];return this}
        ;var a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove"]
        ;for(var c=0;c<a.length;c++){s(o,a[c])}n.Identify=o;var u=function(){this._q=[]
        ;return this}
        ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
        ;for(var p=0;p<l.length;p++){s(u,l[p])}n.Revenue=u
        ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId","setLibrary","setTransport"]
        ;function v(e){function t(t){e[t]=function(){
        e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
        for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
        e=(!e||e.length===0?"$default_instance":e).toLowerCase()
        ;if(!Object.prototype.hasOwnProperty.call(n._iq,e)){n._iq[e]={_q:[]};v(n._iq[e])
        }return n._iq[e]};e.amplitude=n})(window,document);

        // window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
        window.amplitude.init(AMPLITUDE_API_KEY, {
            "fetchRemoteConfig":true,
            "serverZone":"EU",
            "autocapture":{
                "attribution":true,
                "fileDownloads":true,
                "formInteractions":true,
                "pageViews":true,
                "sessions":true,
                "elementInteractions":true,
                "networkTracking":true,
                "webVitals":true,
                "frustrationInteractions":true
            }
        });
    }

    function enableTracking() {
        console.log('Tracking enabled');
        loadAmplitude();
        window.dispatchEvent(new CustomEvent('cookie-consent-given'));
    }

    function showBanner() {
        // Check if banner already exists
        if (document.getElementById('cookie-consent-banner')) return;
        
        // Expose globally
        window.showCookieBanner = showBanner;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'cookie-consent-overlay';
        // Using standard Tailwind classes where possible, and custom classes defined in cookie-consent.css
        overlay.className = 'fixed inset-0 bg-black-50 backdrop-blur-sm z-9998 transition-opacity duration-300 flex items-center justify-center';
        
        // Create modal
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'relative bg-brand-dark text-white p-8 rounded-2xl shadow-2xl z-9999 max-w-lg w-90-percent border border-white-10';
        
        // Content for the initial view
        const initialContent = `
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white-10 mb-4">
                    <svg class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold font-heading text-white mb-2">We value your privacy</h3>
                <p class="text-gray-400 mb-6 text-sm leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    We need your consent to use some of these technologies.
                </p>
                <div class="flex flex-col space-y-3">
                    <button id="cookie-accept-all" class="w-full px-4 py-3 bg-accent hover-brightness-105 text-white rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer">
                        Accept All
                    </button>
                    <button id="cookie-manage" class="w-full px-4 py-3 bg-brand-black border border-white-10 hover-bg-brand-gray text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                        Manage Preferences
                    </button>
                </div>
            </div>
        `;

        // Content for the preferences view
        const preferencesContent = `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold font-heading text-white">Cookie Preferences</h3>
                    <button id="cookie-back" class="text-gray-400 hover-text-accent transition-colors cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                    <div class="flex items-start justify-between p-3 bg-brand-black rounded-lg border border-white-10">
                        <div>
                            <p class="font-semibold text-sm text-white">Essential</p>
                            <p class="text-xs text-gray-400 mt-1">Required for the website to function.</p>
                        </div>
                        <input type="checkbox" checked disabled class="mt-1 h-4 w-4 text-accent rounded border-gray-300">
                    </div>
                    <div class="flex items-start justify-between p-3 bg-brand-black rounded-lg border border-white-10">
                        <div>
                            <p class="font-semibold text-sm text-white">Analytics</p>
                            <p class="text-xs text-gray-400 mt-1">Help us understand how you use our site.</p>
                        </div>
                        <input type="checkbox" id="toggle-analytics" class="mt-1 h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent">
                    </div>
                </div>
                <div class="flex flex-col space-y-3">
                    <button id="cookie-save" class="w-full px-4 py-3 bg-accent hover-opacity-90 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">
                        Save Preferences
                    </button>
                    <button id="cookie-accept-all-prefs" class="w-full px-4 py-3 bg-accent hover-brightness-105 text-white rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        banner.innerHTML = initialContent;
        overlay.appendChild(banner);
        document.body.appendChild(overlay);

        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';

        function closeBanner() {
            overlay.remove();
            document.body.style.overflow = '';
        }

        function handleAcceptAll() {
            localStorage.setItem('cookie_consent', 'accepted');
            closeBanner();
            enableTracking();
        }

        function handleSave(analyticsEnabled) {
            if (analyticsEnabled) {
                localStorage.setItem('cookie_consent', 'accepted');
                enableTracking();
            } else {
                // User selected essential only
                localStorage.setItem('cookie_consent', 'essential');
            }
            closeBanner();
        }

        // Event Delegation or re-attaching listeners
        function attachInitialListeners() {
            document.getElementById('cookie-accept-all').addEventListener('click', handleAcceptAll);
            document.getElementById('cookie-manage').addEventListener('click', () => {
                banner.innerHTML = preferencesContent;
                attachPreferencesListeners();
            });
        }

        function attachPreferencesListeners() {
            document.getElementById('cookie-back').addEventListener('click', () => {
                banner.innerHTML = initialContent;
                attachInitialListeners();
            });
            
            document.getElementById('cookie-accept-all-prefs').addEventListener('click', handleAcceptAll);
            
            document.getElementById('cookie-save').addEventListener('click', () => {
                const analyticsChecked = document.getElementById('toggle-analytics').checked;
                handleSave(analyticsChecked);
            });
        }

        attachInitialListeners();
    }

    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
        enableTracking();
    } else if (consent !== 'declined' && consent !== 'essential') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showBanner);
        } else {
            showBanner();
        }
    }
})();
