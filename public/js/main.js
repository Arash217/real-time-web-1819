const socket = io();
MicroModal.init();

const filterForm = document.getElementById('filter-form');
const comments = document.getElementById('comments');
const lineCtx = document.getElementById('line-chart');
const pieCtx = document.getElementById('pie-chart');

const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        datasets: [{
            data: [],
            label: "Comments per minute",
            borderColor: 'rgba(82, 150, 221, 0.5)',
            backgroundColor: 'rgba(82, 150, 221, 0.5)',
        }],
    },
    options: {
        elements: {
            line: {
                tension: 0
            }
        },
        responsive: true,
    }
});

const pieChart = new Chart(pieCtx, {
    type: 'horizontalBar',
    options: {
        maintainAspectRatio: false,
        responsive: true,
    },
    data: {
        datasets: [{
            data: []
        }],
    }
});

const removeNode = selector => {
    if (document.contains(document.querySelector(selector))) {
        document.querySelector(selector).remove();
    }
};

const removeChildNodes = parent => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

const loader = `<div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>`;

const addLoader = () => {
    comments.insertAdjacentHTML('afterbegin', loader);
};

const resetCharts = () => {
    lineChart.data.labels = [];
    lineChart.data.datasets[0].data = [];
    lineChart.update();
};

const inputEventHandler = e => {
    e.preventDefault();
    removeChildNodes(comments);
    addLoader();
    resetCharts();
    const filterFormData = new FormData(filterForm);
    socket.emit('filter', filterFormData.get('filter'));
};

filterForm.addEventListener('submit', inputEventHandler);

const updatePieChart = subreddit => {
    const { labels, datasets } = pieChart.data;
    const index = labels.indexOf(subreddit);
    if (index === -1) {
        labels.push(subreddit);
        datasets[0].data.push(1);
    } else {
        datasets[0].data[index]++;
    }

    pieChart.update();
};

let firstEmit = false;
socket.on('comment', comment => {
    const { childNodes } = comments;
    const childNodesLength = childNodes.length;

    removeNode('.spinner');

    if (childNodesLength >= 25) {
        const lastCommentNode = childNodes[childNodesLength - 1];
        comments.removeChild(lastCommentNode);
    }

    comments.insertAdjacentHTML('afterbegin', comment.commentNode);
    updatePieChart(comment.commentData.subreddit);
});

const updateLineChart = ({commentPerMinute, timeElapsed}) => {
    const { datasets } = lineChart.data;

    if (datasets[0].data.length >= 30){
        lineChart.data.labels.shift();
        datasets[0].data.shift();
    }

    lineChart.data.labels.push(timeElapsed);
    datasets[0].data.push(commentPerMinute);

    lineChart.update();
};

socket.on('commentCounter', data => {
    updateLineChart(data);
});

const logout = () => {
    console.log('remove');
    this.session = null;
};

const dropdown = document.getElementById('dropdown-btn');
dropdown.addEventListener('click', () => {
    document.getElementById("myDropdown").classList.toggle("show");
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        const myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
};