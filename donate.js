/* ========================================
   DONATION PAGE JAVASCRIPT
   Handles donation amount selection and UPI payment
   ======================================== */

// Track selected donation amount
let selectedAmount = 0;

// UPI Payment Configuration
const upiId = 'sahityasingh200805@oksbi';
const payeeName = 'Sahitya Singh';

// Get HTML elements
const amountInput = document.getElementById('custom-amount');
const amountError = document.getElementById('amount-error');
const selectedTotal = document.getElementById('selected-total');
const impactLine = document.getElementById('impact-line');
const payLink = document.getElementById('pay-link');
const paidButton = document.getElementById('paid-btn');
const successOverlay = document.getElementById('success-overlay');
const closeSuccessButton = document.getElementById('close-success');
const copyUpiButton = document.getElementById('copy-upi');

/**
 * Returns impact message based on donation amount
 * @param {number} amount - Donation amount in rupees
 * @returns {string} Impact message
 */
function getImpactText(amount) {
  if (amount >= 1000) {
    return 'This can support meals and education material for children.';
  }
  if (amount >= 500) {
    return 'This can help feed a small family for multiple days.';
  }
  if (amount >= 100) {
    return 'This can help serve a meal to someone tonight.';
  }
  return 'Every rupee helps move food closer to someone who needs it.';
}

/**
 * Creates a UPI payment link
 * @param {number} amount - Donation amount
 * @returns {string} UPI deep link
 */
function createUpiLink(amount) {
  const note = `Donation to Robin Hood Army - Rs ${amount}`;
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount,
    cu: 'INR',
    tn: note
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Updates payment display with selected amount
 * @param {number} amount - Donation amount
 */
function updatePayment(amount) {
  selectedAmount = Number(amount);
  selectedTotal.innerText = `₹${selectedAmount.toLocaleString('en-IN')}`;
  impactLine.innerText = getImpactText(selectedAmount);
  amountError.innerText = '';
  
  payLink.href = createUpiLink(selectedAmount);
  payLink.innerText = `Pay ₹${selectedAmount.toLocaleString('en-IN')} with UPI`;
  payLink.setAttribute('aria-disabled', 'false');
}

/**
 * Clears payment selection
 */
function clearPayment() {
  selectedAmount = 0;
  selectedTotal.innerText = '₹0';
  impactLine.innerText = 'Select an amount to see the impact.';
  payLink.href = '#';
  payLink.innerText = 'Enter amount to pay';
  payLink.setAttribute('aria-disabled', 'true');
}

/**
 * Handles donation card click
 * @param {HTMLElement} card - Clicked donation card
 */
function selectCard(card) {
  // Remove active state from all cards
  document.querySelectorAll('.donation-card').forEach((item) => {
    item.classList.remove('active');
  });
  
  // Activate clicked card
  card.classList.add('active');
  amountInput.value = '';
  updatePayment(card.dataset.amount);
}

/**
 * Handles custom amount input
 */
function handleCustomAmount() {
  const amount = Number(amountInput.value);
  
  // Deselect preset cards when typing custom amount
  document.querySelectorAll('.donation-card').forEach((card) => {
    card.classList.remove('active');
  });
  
  // Handle empty input
  if (!amountInput.value) {
    clearPayment();
    amountError.innerText = '';
    return;
  }
  
  // Validate amount is greater than 0
  if (amount < 1) {
    clearPayment();
    amountError.innerText = 'Please enter an amount greater than ₹0.';
    return;
  }
  
  updatePayment(amount);
}

/**
 * Validates amount before payment
 * @param {Event} event - Click event
 */
function handlePayClick(event) {
  if (!selectedAmount) {
    event.preventDefault();
    amountError.innerText = 'Please select or enter an amount first.';
  }
}

/**
 * Shows success confirmation modal
 */
function showSuccess() {
  if (!selectedAmount) {
    amountError.innerText = 'Please select or enter an amount first.';
    return;
  }
  successOverlay.classList.add('active');
}

/**
 * Closes success modal and redirects to home
 */
function closeSuccess() {
  successOverlay.classList.remove('active');
  window.location.href = 'robinhoodarmy-clone.html';
}

/**
 * Copies UPI ID to clipboard
 */
async function copyUpiId() {
  try {
    await navigator.clipboard.writeText(upiId);
    copyUpiButton.innerText = 'Copied UPI ID';
    setTimeout(() => {
      copyUpiButton.innerText = upiId;
    }, 1600);
  } catch (error) {
    alert(`UPI ID: ${upiId}`);
  }
}

/**
 * Fetches and updates progress bars from stats.json
 */
async function updateProgress() {
  try {
    const response = await fetch('data/stats.json');
    const data = await response.json();
    
    // Update all three progress bars
    updateBar('daily-progress-bar', data.currentDaily, data.dailyGoal, 'daily-progress-text');
    updateBar('weekly-progress-bar', data.currentWeekly, data.weeklyGoal, 'weekly-progress-text');
    updateBar('edu-progress-bar', data.currentEducation, data.educationGoal, 'edu-progress-text');
  } catch (error) {
    console.error('Could not load donation stats.', error);
  }
}

/**
 * Updates individual progress bar
 * @param {string} barId - Progress bar element ID
 * @param {number} current - Current progress value
 * @param {number} goal - Goal value
 * @param {string} textId - Text display element ID
 */
function updateBar(barId, current, goal, textId) {
  const bar = document.getElementById(barId);
  const text = document.getElementById(textId);
  const percentage = (current / goal) * 100;
  
  bar.style.width = `${Math.min(percentage, 100)}%`;
  text.innerText = `${current.toLocaleString('en-IN')} / ${goal.toLocaleString('en-IN')}`;
}

/**
 * Initialize all event listeners when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load and display progress stats
  updateProgress();
  
  // Add click handlers to donation cards
  document.querySelectorAll('.donation-card').forEach((card) => {
    card.addEventListener('click', () => selectCard(card));
  });
  
  // Handle custom amount input
  amountInput.addEventListener('input', handleCustomAmount);
  
  // Handle payment button click
  payLink.addEventListener('click', handlePayClick);
  
  // Handle payment confirmation button
  paidButton.addEventListener('click', showSuccess);
  
  // Handle success modal close button
  closeSuccessButton.addEventListener('click', closeSuccess);
  
  // Handle UPI ID copy button
  copyUpiButton.addEventListener('click', copyUpiId);
});
