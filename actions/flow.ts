import FlowClient from "../core/FlowClient"
import JobQueue from "../core/JobQueue"

const jobs = new JobQueue();

const client = new FlowClient(jobs);

const ms = new Date().getTime();

client.startFlow(`scrape${ms}`, '../flowDefs/scrapeRestaurants')
    .catch(err => console.error('runFlow', err));
