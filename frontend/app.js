// API Configuration - change this to your deployed backend URL
const API_URL = 'http://localhost:3000/api';

// State
let songs = [];

// DOM Elements
const modal = document.getElementById('songModal');
const addSongBtn = document.getElementById('addSongBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const songForm = document.getElementById('songForm');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addSongBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    songForm.addEventListener('submit', handleAddSong);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Modal Functions
function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    songForm.reset();
}

// API Functions
async function loadSongs() {
    try {
        const response = await fetch(`${API_URL}/songs`);
        if (!response.ok) throw new Error('Failed to fetch songs');

        songs = await response.json();
        renderBoard();
    } catch (error) {
        console.error('Error loading songs:', error);
        alert('Failed to load songs. Make sure the backend is running.');
    }
}

async function handleAddSong(e) {
    e.preventDefault();

    const formData = new FormData(songForm);
    const newSong = {
        title: formData.get('title'),
        youtube_url: formData.get('youtube_url') || null,
        difficulty: formData.get('difficulty'),
        status: formData.get('status')
    };

    try {
        const response = await fetch(`${API_URL}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSong)
        });

        if (!response.ok) throw new Error('Failed to add song');

        const createdSong = await response.json();
        songs.push(createdSong);
        renderBoard();
        closeModal();
    } catch (error) {
        console.error('Error adding song:', error);
        alert('Failed to add song. Please try again.');
    }
}

async function updateSongStatus(songId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/songs/${songId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update song');

        const updatedSong = await response.json();
        const index = songs.findIndex(s => s.id === songId);
        if (index !== -1) {
            songs[index] = updatedSong;
        }
        renderBoard();
    } catch (error) {
        console.error('Error updating song:', error);
        alert('Failed to update song status. Please try again.');
    }
}

async function deleteSong(songId) {
    if (!confirm('Are you sure you want to delete this song?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/songs/${songId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete song');

        songs = songs.filter(s => s.id !== songId);
        renderBoard();
    } catch (error) {
        console.error('Error deleting song:', error);
        alert('Failed to delete song. Please try again.');
    }
}

// Render Functions
function renderBoard() {
    const statuses = ['Want to Learn', 'Currently Learning', 'Learned', 'Mastered'];

    statuses.forEach(status => {
        const container = document.querySelector(`.cards-container[data-status="${status}"]`);
        const countElement = document.querySelector(`.kanban-column[data-status="${status}"] .song-count`);

        const statusSongs = songs.filter(song => song.status === status);
        countElement.textContent = statusSongs.length;

        container.innerHTML = '';

        statusSongs.forEach(song => {
            const card = createSongCard(song);
            container.appendChild(card);
        });
    });
}

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.draggable = true;
    card.dataset.songId = song.id;

    const youtubeLink = song.youtube_url
        ? `<a href="${song.youtube_url}" target="_blank" class="youtube-link">▶ Watch Tutorial</a>`
        : '';

    card.innerHTML = `
        <div class="card-header">
            <div class="song-title">${escapeHtml(song.title)}</div>
            <button class="delete-btn" onclick="deleteSong(${song.id})">×</button>
        </div>
        <div class="difficulty-badge difficulty-${song.difficulty}">${song.difficulty}</div>
        ${youtubeLink}
    `;

    // Drag and Drop Events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

// Drag and Drop Handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

// Setup drag and drop for containers
document.querySelectorAll('.cards-container').forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (e.target.classList.contains('cards-container')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('cards-container')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.preventDefault();

    const container = e.target.closest('.cards-container');
    if (!container) return;

    container.classList.remove('drag-over');

    if (draggedElement) {
        const songId = parseInt(draggedElement.dataset.songId);
        const newStatus = container.dataset.status;

        updateSongStatus(songId, newStatus);
    }

    return false;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
