const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const scenarios = {
  'one-critical-retry-repeat': {CRITICAL:'retry', filter:'TDV2-943 critical target', expected:1},
  'critical-failure': {CRITICAL:'fail', filter:'TDV2-943 critical target', expected:1},
  'one-critical-retry': {CRITICAL:'retry', filter:'TDV2-943 critical target', expected:1},
  'two-critical-retries': {CRITICAL:'retry', SECOND:'retry', filter:'TDV2-943 (critical|second critical) target', expected:1},
  'eleven-critical-retries': {capacity:'11', filter:'TDV2-943 capacity reference (0[1-9]|1[01])$', expected:1},
  'ten-critical-retries': {capacity:'10', filter:'TDV2-943 capacity reference (0[1-9]|10)$', expected:1},
  'critical-pass': {filter:'TDV2-943 critical target', expected:0},
  'critical-skipped': {CRITICAL:'skip', filter:'TDV2-943 critical target', expected:0},
  'ordinary-failure': {ORDINARY:'fail', filter:'TDV2-943 ordinary target', expected:1},
  'ordinary-retry': {ORDINARY:'retry', filter:'TDV2-943 ordinary target', expected:0},
};
const names = process.argv[2] === '--986' ? ['one-critical-retry','one-critical-retry-repeat','critical-pass'] : process.argv[2] === '--finish' ? ['critical-failure','one-critical-retry'] : process.argv[2] === '--matrix' ? Object.keys(scenarios) : [process.argv[2]];
const token = process.env.TESTDINO_TOKEN;
for(const name of names) {
  const s=scenarios[name]; if(!s)throw Error('Unknown scenario');
  const folder=path.resolve('output/tdv2-950',new Date().toISOString().replace(/[:.]/g,'-')+'-'+name);
  fs.mkdirSync(folder,{recursive:true});
  const env={...process.env,TDV2_QA_TOKEN:token,TESTDINO_CI_RUN_ID:'tdv2-950-'+process.env.GITHUB_RUN_ID+'-'+name,TDV2_943_ENABLED:'1',TDV2_QA_EVIDENCE:path.join(folder,'results.json'),TDV2_QA_ARTIFACTS:path.join(folder,'artifacts'),TDV2_943_CRITICAL:s.CRITICAL||'pass',TDV2_943_SECOND:s.SECOND||'pass',TDV2_943_ORDINARY:s.ORDINARY||'pass',TDV2_943_QUARANTINE:'pass',TDV2_950_CAPACITY_RETRIES:s.capacity||'0',TDV2_950_FILTER:s.filter};
  const r=spawnSync(process.execPath,[require.resolve('@playwright/test/cli',{paths:[process.cwd()]}),'test','--config=playwright.config.ts','--project=chromium'],{env,encoding:'utf8'});
  const log=(r.stdout||'')+(r.stderr||''); fs.writeFileSync(path.join(folder,'console.log'),log);
  const record={scenario:name,expectedExit:s.expected,actualExit:r.status,exitMatches:r.status===s.expected,ruleMessages:log.split('\n').filter(l=>/TestDino Test Controls:|Build fails:|Critical tests failed:/.test(l)).map(l=>l.replace(/\u001b\[[0-9;]*m/g,'')),runLinks:[...new Set(log.match(/https:\/\/[^\s]+\/test-runs\/[^\s]+/g)||[])],evidence:folder};
  fs.writeFileSync(path.join(folder,'execution.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record));
  const capture=spawnSync(process.execPath,['../.github/qa/capture-950.cjs',name],{env:process.env,encoding:'utf8'});if(capture.status!==0)console.error(capture.stderr);
}
