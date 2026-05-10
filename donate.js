// Donation Logic
let selectedAmount = 0;

const selectCard = (el, amount) => {
    document.querySelectorAll('.donation-card').forEach(card => card.classList.remove('active'));
    el.classList.add('active');
    selectedAmount = amount;
    document.getElementById('custom-amount').value = '';
};

const updateProgress = async () => {
    try {
        const response = await fetch('data/stats.json');
        const data = await response.json();

        const updateBar = (id, current, goal, textId) => {
            const bar = document.getElementById(id);
            const text = document.getElementById(textId);
            const percentage = (current / goal) * 100;
            bar.style.width = `${Math.min(percentage, 100)}%`;
            text.innerText = `${current.toLocaleString()} / ${goal.toLocaleString()}`;
        };

        updateBar('daily-progress-bar', data.currentDaily, data.dailyGoal, 'daily-progress-text');
        updateBar('weekly-progress-bar', data.currentWeekly, data.weeklyGoal, 'weekly-progress-text');
        updateBar('edu-progress-bar', data.currentEducation, data.educationGoal, 'edu-progress-text');
    } catch (error) {
        console.error('Error updating progress:', error);
    }
};

const handleDonate = () => {
    const customVal = document.getElementById('custom-amount').value;
    const finalAmount = customVal || selectedAmount;

    if (!finalAmount || finalAmount <= 0) {
        alert('Please select or enter a valid donation amount.');
        return;
    }

    // Success Animation
    document.getElementById('success-overlay').style.display = 'flex';
    triggerConfetti();
};

const closeSuccess = () => {
    document.getElementById('success-overlay').style.display = 'none';
    window.location.href = 'index.html';
};

const triggerConfetti = () => {
    // Simple CSS-based confetti or just a placeholder for now
    // In a real project, we might use a library like canvas-confetti
    console.log('Confetti triggered!');
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();

    document.querySelectorAll('.donation-card').forEach(card => {
        card.addEventListener('click', () => {
            selectCard(card, card.dataset.amount);
        });
    });

    document.getElementById('donate-btn').addEventListener('click', handleDonate);

    document.getElementById('custom-amount').addEventListener('input', (e) => {
        if (e.target.value > 0) {
            document.querySelectorAll('.donation-card').forEach(card => card.classList.remove('active'));
            selectedAmount = 0;
        }
    });
});
