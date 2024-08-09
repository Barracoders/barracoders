document.addEventListener("DOMContentLoaded", function() {
    const revealDate = new Date('2025-02-18T16:10:00-05:00'); // Eastern Time

    function updateCountdown() {
        const now = new Date();
        const timeDiff = revealDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        document.getElementById('countdown-timer').innerText =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
