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
        }],
    },
    options: {
        elements: {
            line: {
                tension: 0
            }
        }
    }
});

const pieChart = new Chart(pieCtx, {
    type: 'horizontalBar',
    data: {
        datasets: [{
            data: []
        }],
    }
});


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