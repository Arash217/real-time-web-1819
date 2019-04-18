const socket = io();

const filterForm = document.getElementById('filter-form');
const comments = document.getElementById('comments');

filterForm.addEventListener('submit', e => {
    e.preventDefault();
    const filterFormData = new FormData(filterForm);
    socket.emit('filter', filterFormData.get('filter'));
});

socket.on('comment', comment => {
    comments.insertAdjacentHTML('afterbegin', comment);
});