const socket = io();
MicroModal.init();

const filterForm = document.getElementById('filter-form');
const comments = document.getElementById('comments');
const lineCtx = document.getElementById('line-chart');
const grapCtx = document.getElementById('graph-chart');

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
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

const graphChart = new Chart(grapCtx, {
    type: 'horizontalBar',
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    },
    data: {
        datasets: [{
            data: [],
            label: 'Top 10 searches all time',
            borderColor: 'rgba(82, 150, 221, 0.5)',
            backgroundColor: 'rgba(82, 150, 221, 0.5)',
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
    const filterFormData = new FormData(filterForm);
    const filter = filterFormData.get('filter');

    if (filter && filter.trim() !== '') {
        removeChildNodes(comments);
        addLoader();
        resetCharts();
        socket.emit('filter', filter);
    }
};

filterForm.addEventListener('submit', inputEventHandler);

socket.on('comment', comment => {
    const {childNodes} = comments;
    const childNodesLength = childNodes.length;

    removeNode('.spinner');

    if (childNodesLength >= 25) {
        const lastCommentNode = childNodes[childNodesLength - 1];
        comments.removeChild(lastCommentNode);
    }

    comments.insertAdjacentHTML('afterbegin', comment.commentNode);
});

const updateLineChart = async ({commentPerMinute, timeElapsed}) => {
    const {datasets} = lineChart.data;

    if (datasets[0].data.length >= 30) {
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

const clearArray = (array) => {
    while (array.length > 0) {
        array.pop();
    }
};

const updateGraphChart = async searches => {
    let {labels, datasets} = graphChart.data;

    clearArray(labels);
    clearArray(datasets[0].data);

    searches.forEach(search => {
        labels.push(search.search);
        datasets[0].data.push(search.count);
    });

    graphChart.update();
};

socket.on('search', data => {
    updateGraphChart(data);
});

const dropdown = document.getElementById('dropdown-btn');

if (dropdown) {
    dropdown.addEventListener('click', () => {
        document.getElementById("myDropdown").classList.toggle("show");
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (e) {
        if (!e.target.matches('.dropbtn')) {
            const myDropdown = document.getElementById("myDropdown");
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show');
            }
        }
    };
}