# testdino-e2e-check — TDV2-1087

QA project for [TDV2-1087](https://testdino.atlassian.net/browse/TDV2-1087):
TestDino identifies the test runner on a run, starting with the e2e framework by TesterArmy.

It holds two suites against https://storedemo.testdino.com, both reporting to TestDino staging:

| Suite | Runner | Reporter | Config / files |
| --- | --- | --- | --- |
| e2e desktop | `e2e` 0.21.3 + `@e2e-dev/web` | `@testdino/e2e` (1.1.0 test build) | `e2e.config.ts`, `e2e/*.e2e.ts` |
| e2e phones | same | same | `e2e.mobile.config.ts`, `e2e-mobile/*.e2e.ts` |
| e2e edge cases | same | same | `e2e.edge.config.ts`, `edge/*.e2e.ts` |
| Playwright | `@playwright/test` 1.58.2 | `@testdino/playwright` | `playwright.config.ts`, `playwright/*.spec.ts` |

## Browsers

| Suite | Targets / projects |
| --- | --- |
| e2e desktop | `chromium`, `firefox`, `webkit` (Safari engine), all 1280×720 |
| e2e phones | `mobile-safari` (WebKit, 390×844, iPhone UA), `mobile-chrome` (Chromium, 412×915, Pixel UA) |
| Playwright | `chromium`, `chrome` (installed Google Chrome), `firefox`, `webkit`, `mobile-safari` (iPhone 13), `mobile-chrome` (Pixel 7) |

Phones are browser emulation. Real iOS/Android devices need `@e2e-dev/mobile` and
simulators; the ticket lists mobile targets as out of scope. Storedemo hides the
desktop menu, cart and wishlist below ~1024 px, so phones run their own tests.

Run one browser: `npx e2e run --target webkit` or `npx playwright test --project=chrome`.

## Expected results

**e2e desktop** (`npm run e2e`): 3 targets, `retries: 1`.

| | per target | total |
| --- | --- | --- |
| Passed | 15 | 45 |
| Failed | 1 — `close carts button can be tapped (fails by design)` | 3 |
| Flaky | 1 — `cart icon is shown (flaky by design)` | 3 |
| Skipped | 1 — `wishlist can be exported as PDF (skipped by design)` | 3 |
| **Total** | 18 | **54** |

Spec cards: `home.e2e.ts` = 18, `pages.e2e.ts` = 15, `cart.e2e.ts` = 12, `navigation.e2e.ts` = 9.

**e2e phones** (`npm run e2e:mobile`): 12 tests — 10 passed, 2 failed by design.

**e2e edge cases** (`npm run e2e:edge`): 11 tests — 4 passed, 4 failed (timeout, plain
error, HTML in message, serial member), 3 skipped (runtime skip, serial member, registration skip).

**Playwright** (`npm run pw`): 100 tests — 86 passed, 6 failed, 4 flaky, 4 skipped
(22 per desktop project, 6 per phone project).

## Setup

Node `^22.22.3` or `>=24.8.0` (needed by e2e 0.21.3).

```bash
npm install
npm run install:browsers      # Chromium, Firefox, WebKit for e2e and Playwright
cp .env.example .env          # fill in TESTDINO_TOKEN (staging project key)
```

Install the 1.1.0 test build of the reporter attached to the ticket
(the 29 Oct build after 16:19, 30 KB, from testdino-playwright-cli #83 at `ebad6a9`):

1. Download `testdino-e2e-1.1.0.tgz` from the Jira ticket into `vendor/`.
2. `npm run install:test-build` — must print `@testdino/e2e@1.1.0`.

Check versions with `npm run check:versions`.

Before testing, make sure microservices #1459 is deployed on staging.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run e2e` | Full e2e run (18 tests). Open Test runs on lab.testdino.com as soon as it starts. |
| `npm run e2e:filtered` | e2e run with `--grep "home page shows the header"`: total must be 2 and not marked incomplete. |
| `npm run e2e:long` | One test that idles 2.5 min: the run must stay running, not end as incomplete. |
| `npm run e2e:sharded` | e2e as parallel shards with one `TESTDINO_CI_RUN_ID` (default `SHARDS=3 WORKERS=2`): one merged run with a Shards panel. |
| `npm run pw` | Full Playwright run (unsharded). |
| `npm run pw:sharded` | Playwright as parallel shards with one `TESTDINO_CI_RUN_ID` (default `SHARDS=3 WORKERS=2`): one merged run, spec cards show full file totals. |
| `npm run reset` | Clears flaky markers in `.e2e-state/`. Every `e2e*` script runs it first. |

Re-run (copy the command from the Re-run sheet on the run, same `.env`):

```bash
npx -p @testdino/e2e testdino-e2e rerun --from-run test_run_… --scope failed
```

Expected: only the 2 failed tests run, and the new run's total is 2.

## Ticket checks → how this project covers them

| Ticket check | Covered by |
| --- | --- |
| Run appears live, Running tab, Active runs worker line, tests finish one by one | `npm run e2e` — 4 slow tests per target (6–7 s each) |
| Run stays running during a 2+ min quiet test | `npm run e2e:long` |
| Counts match the e2e terminal summary | `npm run e2e` (see the table above) |
| Spec cards show real totals | `npm run e2e` / `npm run e2e:sharded` (12 / 10 / 8 / 6), `npm run pw:sharded` (7 / 6 / 5 / 4) |
| Configuration: "e2e 0.21.3" + Targets table (`desktop`, `desktop-wide`) | `npm run e2e` |
| Error Details: page at failure, Closest matches on screen | failing test taps `getByRole("button", "Close carts")`; the real button is "Close cart", so e2e records it as a near match |
| Console: the app's log lines with their step | failing test logs `console.log/warn/error` in the page |
| Walkthrough on last attempt of failed and flaky tests; none on first attempt or passed tests | `trace: 'retain-on-failure'` in `e2e.config.ts` |
| Filtered run total | `npm run e2e:filtered` |
| Re-run sheet + command | the e2e run, then the copied rerun command |
| Playwright unchanged: Playwright version, settings table, trace viewer, Re-run sheet | `npm run pw` (`trace: 'on-first-retry'`) |

**Not covered:** "AI judgment" in Error Details needs an `agent` step with a model configured
in `e2e.config.ts` (`agents.default.model`). This project uses locators only, so no AI judgment appears.

## Notes

- The flaky e2e test keeps its state in `.e2e-state/` because e2e re-imports the file on each retry.
  Without `npm run reset` (for example, a plain `npx e2e run`), the flaky test passes on its first
  attempt and shows as passed.
- Storedemo hides the header menu and cart icon below desktop width, so there is no mobile target.
- `.env`, `.e2e/`, `.e2e-state/`, `test-results/` and `vendor/*.tgz` are git-ignored.
