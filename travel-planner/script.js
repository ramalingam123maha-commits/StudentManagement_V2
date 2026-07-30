// Travel Planner - trip CRUD backed by localStorage

const STORAGE_KEY = 'wanderlust_trips';

const tripForm = document.getElementById('tripForm');
const destinationInput = document.getElementById('destination');
const budgetInput = document.getElementById('budget');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const notesInput = document.getElementById('notes');
const formError = document.getElementById('formError');

const tripList = document.getElementById('tripList');
const emptyState = document.getElementById('emptyState');
const totalTripsEl = document.getElementById('totalTrips');
const upcomingTripsEl = document.getElementById('upcomingTrips');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function loadTrips() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTrips(trips) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function isPastTrip(trip) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(trip.endDate + 'T00:00:00') < today;
}

function renderTrips() {
    const trips = loadTrips();

    const filtered = trips.filter((trip) => {
        if (currentFilter === 'upcoming') return !isPastTrip(trip);
        if (currentFilter === 'past') return isPastTrip(trip);
        return true;
    });

    tripList.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.textContent = trips.length === 0
            ? 'No trips yet. Start planning your first adventure above!'
            : 'No trips match this filter.';
        tripList.appendChild(emptyState);
    } else {
        filtered
            .slice()
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .forEach((trip) => {
                tripList.appendChild(createTripCard(trip));
            });
    }

    totalTripsEl.textContent = trips.length;
    upcomingTripsEl.textContent = trips.filter((t) => !isPastTrip(t)).length;
}

function createTripCard(trip) {
    const past = isPastTrip(trip);

    const card = document.createElement('div');
    card.className = 'trip-card' + (past ? ' past' : '');

    const badge = document.createElement('span');
    badge.className = 'trip-badge' + (past ? ' past' : '');
    badge.textContent = past ? 'Past' : 'Upcoming';
    card.appendChild(badge);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete trip');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteTrip(trip.id));
    card.appendChild(deleteBtn);

    const title = document.createElement('h3');
    title.textContent = trip.destination;
    card.appendChild(title);

    const dates = document.createElement('div');
    dates.className = 'trip-dates';
    dates.textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    card.appendChild(dates);

    if (trip.budget) {
        const budget = document.createElement('div');
        budget.className = 'trip-budget';
        budget.textContent = `Budget: $${Number(trip.budget).toLocaleString()}`;
        card.appendChild(budget);
    }

    if (trip.notes) {
        const notes = document.createElement('div');
        notes.className = 'trip-notes';
        notes.textContent = trip.notes;
        card.appendChild(notes);
    }

    return card;
}

function deleteTrip(id) {
    const trips = loadTrips().filter((trip) => trip.id !== id);
    saveTrips(trips);
    renderTrips();
}

function validateForm() {
    if (!destinationInput.value.trim()) {
        return 'Please enter a destination.';
    }
    if (!startDateInput.value || !endDateInput.value) {
        return 'Please select both start and end dates.';
    }
    if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
        return 'End date cannot be before the start date.';
    }
    return '';
}

tripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
        formError.textContent = error;
        return;
    }
    formError.textContent = '';

    const trips = loadTrips();
    trips.push({
        id: Date.now().toString(),
        destination: destinationInput.value.trim(),
        budget: budgetInput.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        notes: notesInput.value.trim(),
    });
    saveTrips(trips);

    tripForm.reset();
    renderTrips();
});

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTrips();
    });
});

renderTrips();
