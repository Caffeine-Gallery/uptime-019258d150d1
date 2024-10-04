import { backend } from 'declarations/backend';

const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const addEventButton = document.getElementById('add-event');

let currentDate = new Date();

function renderCalendar(year, month) {
    calendar.innerHTML = '';
    currentMonthElement.textContent = `${year} - ${month + 1}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.innerHTML = `
            <div class="date">${day}</div>
            <div class="events"></div>
        `;
        calendar.appendChild(dayElement);
    }

    loadEvents(year, month);
}

async function loadEvents(year, month) {
    try {
        const events = await backend.getEvents(BigInt(year), BigInt(month + 1));
        events.forEach(event => {
            const eventDate = new Date(Number(event.date) / 1000000);
            const dayElement = calendar.children[eventDate.getDate() - 1];
            const eventsContainer = dayElement.querySelector('.events');
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event.title;
            eventElement.title = event.description;
            eventsContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function updateCalendar() {
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

addEventButton.addEventListener('click', async () => {
    const title = document.getElementById('event-title').value;
    const date = new Date(document.getElementById('event-date').value);
    const description = document.getElementById('event-description').value;

    if (title && date) {
        try {
            await backend.addEvent(title, BigInt(date.getTime() * 1000000), description);
            updateCalendar();
            document.getElementById('event-title').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-description').value = '';
        } catch (error) {
            console.error('Error adding event:', error);
        }
    }
});

updateCalendar();
