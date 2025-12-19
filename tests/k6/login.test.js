import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
    return JSON.parse(open('./data/login.test.data.json'))
});

export let options = {
    vus: 7,
    iterations: 7,
    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};

export default function () {
    // const user = users[__VU - 1]; // Numero de VUs igual a numero de itens no JSON
    const user = users[(__VU - 1) % users.length];
    console.log("USUARIO", user)

    const email = user.email
    const password = user.password

    const res = http.post(`${getBaseUrl()}/auth/login`,
        JSON.stringify({ email, password }),
        { headers: { 'Content-Type': 'application/json' } });

    check(res, { 'login status 200': (r) => r.status === 200 });
    sleep(1);
}
