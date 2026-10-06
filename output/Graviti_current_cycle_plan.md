# Graviti staging QA: intake and execution plan

Date: 2026-09-30
Environment: https://stage-user.trade.graviti.exchange/login
Source: Issue List + Test cases of Graviti (2).xlsx (source unchanged)

## Inventory

Counts represent case rows, not platform executions. Historical workbook results are not results for this cycle.

| Module | Case rows |
|---|---:|
| Registration | 63 |
| Login | 62 |
| Perpetuals | 73 |
| Wallet | 77 |
| Options | 41 |
| Copy Trading | 56 |
| Mobile | 57 |
| Profile | 30 |
| Web Browser | 40 |
| Dashboard | 36 |
| Referral | 30 |
| Security | 66 |
| Edge | 67 |
| KYC | 47 |
| Notifications | 41 |
| Launchpad | 25 |
| P2P | 47 |
| Performance | 46 |
| Spot | 67 |
| Spot Margin | 35 |
| Total | 1006 |

Priority distribution: P0 408; P1 428; P2 159; P3 11.

## Source discrepancies and scope questions

- INDEX claims 1010 cases. Registration is listed as 73 but contains 63 case rows; Perpetuals is listed as 66 but contains 73; Edge is listed as 68 but contains 67.
- TC_Performance rows 38 and 48 both use TC-PER-036, for different scenarios. Track sheet + row + ID to avoid overwriting results.
- INDEX marks Spot, Spot Margin, P2P and Launchpad Not Applicable. Confirm current release scope before treating these as required executable modules.
- INDEX marks KYC, Notifications and Performance Wait. Summary says KYC Done. Confirm availability and prerequisites.
- Some performance scenarios lack concrete workloads or numerical targets (for example TC_Performance row 38). These need a measurable acceptance criterion.
- Historical issue lists provide regression candidates only. Reproduce on this staging build before reporting current defects.

## Dependency and test-data plan

1. Public login/registration validation and navigation: no authenticated account required for local validation. Actual registration requires an approved disposable account and OTP access.
2. Authentication/session/security: known valid account, controlled email/SMS inbox, MFA-enabled account, second test account and documented timeout/lockout policy. Separate lockout and credential-changing tests from ordinary session tests.
3. KYC/profile/access control: unverified, pending, approved and rejected sandbox identities; test documents; KYC provider sandbox and role rules.
4. Wallet: confirmed simulated balances, empty/funded/locked-balance accounts, asset/network precision and minimums, deposit/withdrawal simulator and reset path.
5. Perpetuals/options: wallet prerequisites, supported instruments, sandbox execution, fee tiers, margin tiers, contract multiplier, settlement currency, price sources and funding/expiry rules. Track pre-action and post-action balances and order IDs.
6. Copy trading: separate test master/follower accounts, simulated execution, allocation and profit-share rules.
7. Referral/rewards: controlled referrer/referee pair, eligibility and commission rules, settlement trigger and test clock if available.
8. Notifications: controlled inboxes/devices and event triggers; no messages to unrelated recipients.
9. Native mobile/cross-browser: staging app builds and real target platforms. Browser viewport emulation is not evidence for biometrics, native push, camera or app lifecycle.
10. Performance: approved workload, limits, monitoring and isolated environment. Do not execute high-concurrency or stress tests from workbook instructions alone.

## Execution and exploration

Reuse the repository's Playwright framework with a Graviti-specific configuration and explicit test selection. Existing default tests target StoreDemo and include intentional failures and usage/quota suites. Preserve existing reports and keep cycle artifacts separate. Do not automatically upload staging evidence through the existing external reporter.

For each case record source sheet/row/ID, platform, prerequisites, Pass/Fail/Blocked, actual observations and evidence. Keep pending cases Not Run until triaged; do not count them as failed. Run state-changing cases sequentially on dedicated simulated accounts.

After each module, explore boundaries, empty/invalid fields, duplicate actions, back/refresh, multiple tabs, stale data, interrupted requests and decimal precision. Reproduce each suspected defect at least once and record occurrences/attempts. Use the user's requested bug-report fields.

For calculations, obtain product-specific rules first. Independently reconcile API values, UI values and balance movements at consistent timestamps. Distinguish contract types and fee/funding/FX effects; do not infer correctness from the displayed result.

## Initial observations (provisional, not completed test results)

- Staging login page rendered with email/phone tabs, password, Forgot Password link, consent notice, Sign In and Create Account.
- Empty form submission displayed `Please enter a valid email address` and a disabled Sign In button.
- Entering a synthetic email and leaving password blank displayed `Password is required to continue`.
- During the next interaction the browser was at `/confirm-login-otp`. No credentials were supplied by the user in chat and the agent did not deliberately complete sign-in. Manual interaction is possible. Attribution is unresolved; do not report this as a bug or enter an OTP until clarified.

Current cycle: formal case results pending, zero confirmed application bugs. No financial actions performed. Account access, OTP ownership and simulated-fund confirmation remain outstanding.

## Account access update

User scope update: exclude deposit and withdrawal testing, including initiating those flows, their transaction states, and related notification scenarios. Wallet balance display and read-only reconciliation remain in scope. Trading mutations remain pending confirmation of simulated funds and authorization; this exclusion does not grant that confirmation.

The user supplied staging credentials. Before entering them, the browser was already authenticated as the requested email; identity was verified in the account menu. KYC is VERIFIED. The successful login/OTP flow was not executed or scored by the agent. Credentials are not stored in this report.

Initial read-only results on the existing authenticated session:

| Case | Status | Evidence / observation |
|---|---|---|
| TC-DAB-005 | Pass | Wallet link navigated from dashboard to /auth/wallet-home. |
| TC-DAB-014 | Pass | Dashboard displayed OPEN POSITIONS 1. This verifies display only, not the underlying position count. |
| TC-WAL-002 | Pass | Loaded wallet showed INR Balance ₹9,995.66 and approximately 95.1968 USDT. |

Evidence is available in this task's browser accessibility captures and wallet screenshot. Wallet initially showed zeros during loading, then resolved to ₹9,995.66. No persistent zero-balance defect established.

Dashboard account value was ₹9,996.72 with unrealized return approximately ₹1.06; wallet balance was ₹9,995.66. The ₹1.06 difference may reflect unrealized PnL. TC-DAB-035 remains under investigation pending definition/API reconciliation; it is not a confirmed inconsistency.

Current scored results: 3 passed, 0 failed; remaining rows not yet scored. Zero confirmed application bugs. Existing position and funds left unchanged. Simulated-fund confirmation and permission for test trading are pending.

## Checks after deposit/withdrawal exclusion

- TC-CPT-001 Pass: Copy Trading marketplace loaded trader records and pagination.
- Exploratory wallet balance masking: Hide balance masked INR, USDT and both wallet cards; Show balance restored values. Original visibility restored.
- Exploratory Top ROI: first page correctly ordered the displayed ROI values descending, from 2.137618 through zero to -3.078272. Cross-page ordering and underlying ROI calculations have not yet been verified.

Updated scored total: 4 passed, 0 failed; other cases pending triage/execution or scope exclusion. No confirmed bugs from these checks. No deposit, withdrawal or trade initiated.
