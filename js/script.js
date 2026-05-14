// Improve autoplay unmute and intersection observer handling
document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("bgMusic");

    if (audio) {
        const enableAudio = () => {
            audio.muted = false;
            audio.play().catch((err) => console.log("Autoplay blocked:", err));
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

        // Use passive once listeners where supported
        document.addEventListener("click", enableAudio, { once: true });
        document.addEventListener("touchstart", enableAudio, { once: true });
        document.addEventListener("scroll", enableAudio, { once: true });
        document.addEventListener("keydown", keyHandler, { once: true });
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
