const socket = io();

const filterForm = document.getElementById('filter-form');
const comments = document.getElementById('comments');

const debounce = (fn, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    };
};

const inputEventHandler = e => {
    e.preventDefault();
    const filterFormData = new FormData(filterForm);
    socket.emit('filter', filterFormData.get('filter'));
};

filterForm.addEventListener('input', debounce(inputEventHandler, 300));

socket.on('comment', comment => {
    comments.insertAdjacentHTML('afterbegin', comment);
});