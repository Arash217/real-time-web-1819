const socket = io();

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

const removeChildNodes = parent => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

const inputEventHandler = e => {
    e.preventDefault();
    removeChildNodes(comments);
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

socket.on('comment', comment => {
    const { childNodes } = comments;
    const childNodesLength = childNodes.length;

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

const sidebar = document.getElementById("sidebar");
let sidebarShown = false;
const toggleSidebar = () => sidebarShown =! sidebarShown;
document.querySelector('#chart-btn').addEventListener('click', () => {
    toggleSidebar();
    sidebar.style.width = "100%";
});

sidebar.addEventListener('click', () => {
    if (sidebarShown) {
        toggleSidebar();
        sidebar.style.width = "0";
    }
});