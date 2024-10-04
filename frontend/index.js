import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000);
    updateCalendar();
    setupEventListeners();
    loadFamilyMembers();
});

// ... (previous functions remain unchanged) ...

function setupEventListeners() {
    const prevButton = document.querySelector('.nav-button:first-child');
    const nextButton = document.querySelector('.nav-button:last-child');
    const addButton = document.querySelector('.add-button');
    const settingsIcon = document.querySelector('.settings-icon');
    const modal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close');

    prevButton.addEventListener('click', () => navigateWeek(-1));
    nextButton.addEventListener('click', () => navigateWeek(1));
    addButton.addEventListener('click', showAddEventForm);
    settingsIcon.addEventListener('click', () => modal.style.display = 'block');
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
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

// ... (remaining functions stay the same) ...
