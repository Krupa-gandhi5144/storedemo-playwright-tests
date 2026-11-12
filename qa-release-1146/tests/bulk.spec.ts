import { test } from '@playwright/test'; import { step } from './h';
const n = Number(process.env.BULK || 10);
for (let i = 1; i <= n; i++) test(`q46 bulk ${String(i).padStart(2, '0')}`, step(`bulk${i}`));
