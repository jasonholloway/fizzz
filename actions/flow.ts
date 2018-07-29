import FlowClient from "../core/FlowClient"
import JobQueue from "../core/JobQueue"

const jobs = new JobQueue();

const client = new FlowClient(jobs);

client.startFlow('scrape0', '../flowDefs/scrapeRestaurants')
    .catch(err => console.error('runFlow', err));
