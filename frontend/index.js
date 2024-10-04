import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000);
    updateCalendar();
    setupEventListeners();
});

function updateTime() {
    const now = new Date();
    const timeElement = document.querySelector('.time');
    timeElement.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

async function updateCalendar() {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const dateRange = document.querySelector('.date-range');
    dateRange.textContent = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const dayColumns = document.querySelectorAll('.day-column');
    dayColumns.forEach((column, index) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + index);
        const dayNumber = column.querySelector('.day-number');
        dayNumber.textContent = date.getDate();
    });

    try {
        const events = await backend.getEvents(BigInt(startOfWeek.getFullYear()), BigInt(startOfWeek.getMonth() + 1));
        displayEvents(events, startOfWeek);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function displayEvents(events, startOfWeek) {
    const dayColumns = document.querySelectorAll('.day-column');
    dayColumns.forEach(column => {
        const eventsContainer = column.querySelector('.events');
        if (eventsContainer) {
            eventsContainer.innerHTML = '';
        }
    });

    events.forEach(event => {
        const eventDate = new Date(Number(event.date) / 1000000);
        const dayIndex = (eventDate.getDate() - startOfWeek.getDate() + 7) % 7;
        const dayColumn = dayColumns[dayIndex];
        
        if (dayColumn) {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.style.backgroundColor = getRandomColor();
            eventElement.innerHTML = `
                <div class="event-name">${event.title}</div>
                <div class="event-time">${formatEventTime(eventDate)}</div>
            `;
            dayColumn.appendChild(eventElement);
        }
    });
}

function formatEventTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getRandomColor() {
    const colors = ['#bfdbfe', '#f9a8d4', '#fcd34d', '#86efac', '#c084fc', '#fdba74', '#14b8a6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function setupEventListeners() {
    const prevButton = document.querySelector('.nav-button:first-child');
    const nextButton = document.querySelector('.nav-button:last-child');
    const addButton = document.querySelector('.add-button');

    prevButton.addEventListener('click', () => navigateWeek(-1));
    nextButton.addEventListener('click', () => navigateWeek(1));
    addButton.addEventListener('click', showAddEventForm);
}

function navigateWeek(direction) {
    const dateRange = document.querySelector('.date-range');
    const [startDate] = dateRange.textContent.split(' - ');
    const currentStart = new Date(startDate + ', ' + new Date().getFullYear());
    currentStart.setDate(currentStart.getDate() + direction * 7);
    updateCalendar(currentStart);
}

function showAddEventForm() {
    // Implement the logic to show the add event form
    console.log('Add event form should be shown');
}

// Additional functions for handling family members, to-dos, and other features can be added here
