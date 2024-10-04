import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    initializeLucide();
    updateTime();
    setInterval(updateTime, 60000);
    updateCalendar();
    setupEventListeners();
    loadFamilyMembers();
});

function initializeLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.error('Lucide is not loaded. Using fallback icons.');
        useFallbackIcons();
    }
}

function useFallbackIcons() {
    const iconElements = document.querySelectorAll('[data-lucide]');
    iconElements.forEach(element => {
        const iconName = element.getAttribute('data-lucide');
        element.textContent = getFallbackIcon(iconName);
    });
}

function getFallbackIcon(iconName) {
    const fallbackIcons = {
        'plus': '+',
        'settings': '⚙',
        'calendar': '📅',
        'user': '👤',
        'check-square': '☑',
        'chevron-left': '<',
        'chevron-right': '>'
    };
    return fallbackIcons[iconName] || '?';
}

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
    const settingsIcon = document.querySelector('.settings-icon');
    const settingsModal = document.getElementById('settingsModal');
    const addEventModal = document.getElementById('addEventModal');
    const closeButtons = document.querySelectorAll('.close');
    const addEventForm = document.getElementById('addEventForm');

    prevButton.addEventListener('click', () => navigateWeek(-1));
    nextButton.addEventListener('click', () => navigateWeek(1));
    addButton.addEventListener('click', () => addEventModal.style.display = 'block');
    settingsIcon.addEventListener('click', () => settingsModal.style.display = 'block');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            settingsModal.style.display = 'none';
            addEventModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target == addEventModal) {
            addEventModal.style.display = 'none';
        }
    });

    addEventForm.addEventListener('submit', handleAddEvent);
}

async function handleAddEvent(event) {
    event.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = new Date(document.getElementById('eventDate').value);
    const description = document.getElementById('eventDescription').value;

    try {
        await backend.addEvent(title, BigInt(date.getTime() * 1000000), description);
        alert('Event added successfully!');
        document.getElementById('addEventModal').style.display = 'none';
        updateCalendar();
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.');
    }
}

async function loadFamilyMembers() {
    try {
        const familyMembers = await backend.getFamilyMembers();
        updateFamilyMembersUI(familyMembers);
        populateSettingsModal(familyMembers);
    } catch (error) {
        console.error('Error loading family members:', error);
    }
}

function updateFamilyMembersUI(familyMembers) {
    const familyMembersContainer = document.querySelector('.family-members');
    familyMembersContainer.innerHTML = '';

    familyMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.classList.add('family-member');
        memberElement.innerHTML = `
            <img src="${member.photoUrl || '/api/placeholder/80/80'}" alt="${member.name}" class="avatar">
            <div class="member-name">${member.name}</div>
            <div class="todos">${member.todoCount} to-dos</div>
        `;
        familyMembersContainer.appendChild(memberElement);
    });
}

function populateSettingsModal(familyMembers) {
    const settingsContainer = document.getElementById('familyMemberSettings');
    settingsContainer.innerHTML = '';

    familyMembers.forEach(member => {
        const memberSettings = document.createElement('div');
        memberSettings.classList.add('family-member-settings');
        memberSettings.innerHTML = `
            <h3>${member.name}</h3>
            <input type="text" id="name-${member.id}" value="${member.name}">
            <input type="file" id="photo-${member.id}" accept="image/*">
            <button onclick="updateFamilyMember(${member.id})">Update</button>
        `;
        settingsContainer.appendChild(memberSettings);
    });
}

async function updateFamilyMember(id) {
    const nameInput = document.getElementById(`name-${id}`);
    const photoInput = document.getElementById(`photo-${id}`);
    const name = nameInput.value;
    const photo = photoInput.files[0];

    try {
        let photoUrl = '';
        if (photo) {
            photoUrl = await uploadPhoto(photo);
        }

        await backend.updateFamilyMember(id, name, photoUrl);
        await loadFamilyMembers();
        alert('Family member updated successfully!');
    } catch (error) {
        console.error('Error updating family member:', error);
        alert('Failed to update family member. Please try again.');
    }
}

async function uploadPhoto(photo) {
    // Implement photo upload logic here
    // This could involve sending the photo to a separate file storage service
    // and returning the URL of the uploaded photo
    // For now, we'll return a placeholder URL
    return '/api/placeholder/80/80';
}

function navigateWeek(direction) {
    const dateRange = document.querySelector('.date-range');
    const [startDate] = dateRange.textContent.split(' - ');
    const currentStart = new Date(startDate + ', ' + new Date().getFullYear());
    currentStart.setDate(currentStart.getDate() + direction * 7);
    updateCalendar(currentStart);
}

// Make updateFamilyMember function global so it can be called from HTML
window.updateFamilyMember = updateFamilyMember;
