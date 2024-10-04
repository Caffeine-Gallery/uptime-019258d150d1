import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.error('Lucide is not loaded. Icons may not display correctly.');
    }
    updateTime();
    setInterval(updateTime, 60000);
    updateCalendar();
    setupEventListeners();
    loadFamilyMembers();
});

// ... (rest of the JavaScript code remains unchanged) ...
