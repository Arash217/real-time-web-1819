const socket = io();

const filterForm = document.getElementById('filter-form');
const comments = document.getElementById('comments');
const ctx = document.getElementById('pie-chart');

const pieChart = new Chart(ctx, {
    type: 'pie'
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

const pieData = {
    subreddits: [],
    subredditAmount: [],

    addData(subreddit) {
        const index = this.subreddits.indexOf(subreddit);

        if (index === -1){
            this.subreddits.push(subreddit);
            this.subredditAmount.push(1);
            return;
        }

        this.subredditAmount[index]++;
    },
};

const updatePieChart = subreddit => {
    pieData.addData(subreddit);

    pieChart.data.labels = chartData.pie.subs;
    pieChart.data.datasets = [{data: chartData.pie.commentSubsAmount}];
    pieChart.update();
};

const updateChartsData = commentData => {
    updatePieChart(commentData.subreddit);
};

socket.on('comment', comment => {
    comments.insertAdjacentHTML('afterbegin', comment.commentNode);
    updateChartsData(comment.commentData);
});