class CommentCounter {
    constructor(client) {
        this.client = client;
        this.count = 0;
    }

    increment() {
        this.count++;
        if (!this.startTime) {
            this.startTime = Date.now();
            this.notify();
        }
    }

    getData() {
        const timeElapsed = Date.now() - this.startTime;
        const commentPerMinute = (this.count / timeElapsed) * 1000 * 60;
        return {
            commentPerMinute: CommentCounter.round(commentPerMinute, 1),
            timeElapsed: Math.round(timeElapsed / 1000),
        }
    }

    notify() {
        this.interval = setInterval(() => {
            this.client.emit('commentCounter', this.getData());
        }, 1000)
    }

    clear() {
        clearInterval(this.interval);
    }

    static round(number, precision) {
        precision = precision || 0;
        return parseFloat(parseFloat(number).toFixed(precision));
    }
}

module.exports = CommentCounter;