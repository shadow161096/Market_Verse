import { sleep, check } from 'k6';
import http from 'k6/http';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // ramp up to 20 users
        { duration: '1m', target: 20 },  // stay at 20 users
        { duration: '20s', target: 0 },  // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api/v1';

    // Test products list
    const res = http.get(`${BASE_URL}/products`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'has products': (r) => r.json().length > 0,
    });

    sleep(1);
}
