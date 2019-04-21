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
        const currentTime = Date.now();
        const commentPerMinute = (this.count / (currentTime - this.startTime)) * 1000 * 60;
        return {
            commentPerMinute,
            currentTime
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
}

module.exports = CommentCounter;