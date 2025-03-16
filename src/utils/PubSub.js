class PubSub {
    subscribers = {};

    subscribe(name, fn) {
        if (!this.subscribers[name]) {
            this.subscribers[name] = [];
        }
        this.subscribers[name].push(fn);
    }

    publish(name, data) {
        if (!this.subscribers[name]) return "No such subscriber";
        this.subscribers[name].forEach(sub => (data ? sub(data) : sub()));
    }

    // No need it?
    clean() {
        this.subscribers = {};
    }
}

const pubsub = new PubSub();
export default pubsub;
