import { backend } from 'declarations/backend';

const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const addEventButton = document.getElementById('add-event');
const cancelEventButton = document.getElementById('cancel-event');
const eventForm = document.getElementById('event-form');

let currentDate = new Date();

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderCalendar(year, month) {
    calendar.innerHTML = '';
    currentMonthElement.textContent = `${year} - ${month + 1}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.innerHTML = `
            <div class="date-header">
                <span class="day-of-week">${dayOfWeek}</span>
                <span class="date">${day}</span>
                <i class="fas fa-plus add-event-icon"></i>
            </div>
            <div class="events"></div>
        `;
        calendar.appendChild(dayElement);

        const addEventIcon = dayElement.querySelector('.add-event-icon');
        addEventIcon.addEventListener('click', () => showEventForm(date));
    }

    loadEvents(year, month);
}

function showEventForm(date) {
    eventForm.style.display = 'block';
    document.getElementById('event-date').value = date.toISOString().split('T')[0];
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
            eventForm.style.display = 'none';
            document.getElementById('event-title').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-description').value = '';
        } catch (error) {
            console.error('Error adding event:', error);
        }
    }
});

cancelEventButton.addEventListener('click', () => {
    eventForm.style.display = 'none';
    document.getElementById('event-title').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-description').value = '';
});

updateCalendar();
