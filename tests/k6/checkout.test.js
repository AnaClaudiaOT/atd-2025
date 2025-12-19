import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { randomEmail } from './helpers/randomEmail.js';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { login } from './helpers/login.js';
import faker from 'k6/x/faker';

export let options = {
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requests em menos de 2s
        'checkout_duration': ['p(95)<2000'],
    },
    stages: [
        { duration: '3s', target: 10 }, // Ramp up
        { duration: '15s', target: 10 }, // Average 
        { duration: '2s', target: 100 }, // Spike
        { duration: '3s', target: 100 }, // Spike
        { duration: '5s', target: 10 }, // Average
        { duration: '5s', target: 0 }, // Ramp down
    ],
};

const checkoutDuration = new Trend('checkout_duration');

export default function () {
    let email, password, name, token;

    group('Registrar usuário', function () {
        email = randomEmail();
        name = faker.person.firstName();
        password = faker.internet.password();
        const url = `${getBaseUrl()}/auth/register`;
        const payload = JSON.stringify({ email, password, name });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const res = http.post(url, payload, params);
        check(res, { 'register status 201': (r) => r.status === 201 });
        console.log(payload)
    });

    group('Login', function () {
        token = login(email, password);
    });

    group('Checkout', function () {
        const url = `${getBaseUrl()}/checkout`;
        const payload = JSON.stringify({
            items: [{ productId: 1, quantity: 1 }],
            paymentMethod: 'cash',
        });
        const params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const res = http.post(url, payload, params);
        checkoutDuration.add(res.timings.duration);
        check(res, { 'checkout status 200': (r) => r.status === 200 });
    });
    sleep(1);
}
