// TDV2-1095: real runner-produced agent failures without an AI model.
// A scripted StepExecutor stands in for the model: it hangs (runner raises
// STEP_TIMEOUT), returns blocked verdicts with setup codes, or fails.
//   npm run e2e:agent
import { existsSync } from 'node:fs';
import type { E2EConfig, StepExecutor } from 'e2e';
import { AgentError } from 'e2e';
import { web } from '@e2e-dev/web';
import { testdino } from '@testdino/e2e';

if (existsSync('.env')) process.loadEnvFile('.env');

const scripted: StepExecutor = {
  name: 'tdv2-1095-scripted',
  version: '1',
  cache: 'off',
  async runStep(ctx) {
    const text = ctx.step.instruction;
    // Never answers: the runner's step deadline fires -> STEP_TIMEOUT.
    if (text.startsWith('hang')) return new Promise(() => {});
    // A model that refuses the request.
    if (text.startsWith('refuse')) throw new AgentError('MODEL_REFUSED', 'the model refused to act on this page');
    // blocked:<CODE> -> a blocked verdict carrying that setup code.
    const blocked = /^blocked:([A-Z_]+)/.exec(text);
    if (blocked) {
      return { status: 'blocked', errorCode: blocked[1] as never, summary: `blocked by ${blocked[1]}` };
    }
    // A product verdict: the app did not do what the step required.
    if (text.startsWith('fail')) return { status: 'failed', summary: 'the cart did not show the added item' };
    return { status: 'passed', summary: 'done' };
  },
};

export default {
  projectId: 'testdino-e2e-check',
  tests: 'agent-issues/**/*.e2e.ts',
  output: '.e2e/agent',
  retries: 0,
  workers: 2,
  timeout: 30_000,
  targets: [
    {
      name: 'chromium',
      engine: web({ viewport: { width: 1280, height: 720 } }),
      app: { url: process.env.APP_URL ?? 'https://storedemo.testdino.com' },
    },
  ],
  agents: { default: { executor: scripted } },
  reporters: ['list', testdino({ tags: ['tdv2-1095', 'agent-issues'] })],
} satisfies E2EConfig;
