// Improve autoplay unmute and intersection observer handling
document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("bgMusic");

    if (audio) {
        // Attempt to start playback while muted so browsers allow it,
        // then unmute on first user gesture.
        try { audio.muted = true; audio.play().catch(() => {}); } catch(e) {}

        const enableAudio = () => {
            // Unmute on user interaction and ensure playback resumes
            audio.muted = false;
            // Try to play after unmuting; some browsers still require user gesture
            audio.play().catch((err) => console.debug("Play after gesture failed:", err));
            removeAudioListeners();
        };

        const keyHandler = (e) => {
            if (e.key && e.key.length > 0) enableAudio();
        };

        const removeAudioListeners = () => {
            document.removeEventListener("click", enableAudio);
            document.removeEventListener("touchstart", enableAudio);
            document.removeEventListener("scroll", enableAudio);
            document.removeEventListener("keydown", keyHandler);
        };

        // Attach one-time listeners for common user gestures
        document.addEventListener("click", enableAudio, { once: true });
        document.addEventListener("touchstart", enableAudio, { once: true });
        document.addEventListener("scroll", enableAudio, { once: true });
        document.addEventListener("keydown", keyHandler, { once: true });
    }

    // Audio toggle fallback: show button if playback still blocked after a short delay
    const audioToggle = document.getElementById('audioToggle');
    if (audio && audioToggle) {
        const showIfBlocked = () => {
            // if audio is paused or still muted, show toggle
            if (audio.paused || audio.muted) {
                audioToggle.classList.add('show');
                audioToggle.addEventListener('click', () => {
                    if (audio.paused) {
                        audio.muted = false;
                        audio.play().catch(() => {});
                        audioToggle.textContent = 'Pause music';
                        audioToggle.setAttribute('aria-pressed', 'true');
                    } else {
                        audio.pause();
                        audioToggle.textContent = 'Play music';
                        audioToggle.setAttribute('aria-pressed', 'false');
                    }
                });
            }
        };

        // Check after 700ms; if gesture already enabled audio, this will be a no-op
        setTimeout(showIfBlocked, 700);
        // Also hide button when user interacts and enableAudio runs
        const hideOnGesture = () => { audioToggle.classList.remove('show'); };
        document.addEventListener('click', hideOnGesture, { once: true });
        document.addEventListener('touchstart', hideOnGesture, { once: true });
    }

    // Intersection Observer untuk animasi entrance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe semua elemen dengan class animate-on-scroll
    document.querySelectorAll(".animate-on-scroll").forEach(el => {
        observer.observe(el);
    });
});
