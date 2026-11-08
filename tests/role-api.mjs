// Run only against a fresh, isolated LOCAL built Worker. Fake edge identities are test inputs.
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8787';
const admin='qa-admin@sites.test',alice='qa-alice@sites.test',bob='qa-bob@sites.test',leader='qa-leader@sites.test',professor='qa-professor@sites.test';
async function call(path,email,method='GET',body){const r=await (globalThis.roleFetch||fetch)(base+path,{method,headers:{connection:'close',...(email?{'oai-authenticated-user-id':email,'oai-authenticated-user-email':email}:{}),...(body?{origin:base,'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const text=await r.text();let data;try{data=JSON.parse(text);}catch{data={error:text};}return {status:r.status,data};}
async function expect(path,email,method,body,status=200){const r=await call(path,email,method,body);assert.equal(r.status,status,JSON.stringify({path,...r}));return r.data;}
const apply=(clubId,type='application')=>({type,clubId,name:'Local QA Student',studentEmail:'roles-qa@lsua.edu',message:'Local role authorization test only.',consent:true});
await expect('/api/student',null,'GET',undefined,401);
await expect('/api/leader',null,'GET',undefined,401);
await expect('/api/leader',leader,'GET',undefined,403);
await expect('/api/leader',admin,'GET',undefined,403);
await expect('/api/organizers',alice,'POST',{email:leader,clubId:'chemistry',role:'organizer'},403);
await expect('/api/organizers',admin,'POST',{email:leader,clubId:'chemistry',role:'organizer'});
await expect('/api/organizers',admin,'POST',{email:professor,clubId:'biology',role:'professor'});
const a=await expect('/api/requests',alice,'POST',apply('chemistry'),201),b=await expect('/api/requests',bob,'POST',apply('biology'),201);
const p=await expect('/api/requests',alice,'POST',{...apply(null,'proposal'),clubName:'QA New Club',category:'Arts & creativity'},201);
const leadQueue=await expect('/api/leader',leader,'GET');assert.equal(leadQueue.clubs.length,1);assert.equal(leadQueue.clubs[0].id,'chemistry');assert.deepEqual(leadQueue.requests.map(r=>r.id),[a.id]);
await expect('/api/requests/'+b.id,leader,'PATCH',{status:'approved',note:'Wrong club',confirmed:true},404);
await expect('/api/requests/'+p.id,leader,'PATCH',{status:'approved',note:'Proposal forbidden',confirmed:true},404);
await expect('/api/requests',leader,'GET',undefined,403);
await expect('/api/organizers',leader,'POST',{email:leader,clubId:'biology',role:'organizer'},403);
await expect('/api/requests/'+a.id,alice,'PATCH',{status:'approved',note:'Cannot self approve',confirmed:true},400);
await expect('/api/requests/'+a.id,leader,'PATCH',{status:'approved',note:'Confirmed local enrollment.',confirmed:true});
await expect('/api/requests/'+b.id,professor,'PATCH',{status:'approved',note:'Confirmed local enrollment.',confirmed:true});
const studentA=await expect('/api/student',alice,'GET'),studentB=await expect('/api/student',bob,'GET');assert.equal(studentA.memberships.length,1);assert.equal(studentA.memberships[0].clubId,'chemistry');assert.equal(studentB.memberships[0].clubId,'biology');
const notBob=await expect('/api/student?userId='+bob,alice,'GET');assert.equal(notBob.memberships[0].clubId,'chemistry');
await expect('/api/memberships/'+studentB.memberships[0].id,alice,'DELETE',{},404);
await expect('/api/memberships/'+studentB.memberships[0].id,bob,'DELETE',{});
assert.equal((await expect('/api/student',bob,'GET')).memberships.length,0);
const reapply=await expect('/api/requests',bob,'POST',apply('biology'),201);await expect('/api/requests/'+reapply.id,professor,'PATCH',{status:'approved',note:'Rejoined after local test withdrawal.',confirmed:true});assert.equal((await expect('/api/student',bob,'GET')).memberships.length,1);
const own=await expect('/api/requests',leader,'POST',apply('chemistry'),201);await expect('/api/requests/'+own.id,leader,'PATCH',{status:'approved',note:'Cannot review own application',confirmed:true},400);
const assignment=(await expect('/api/organizers',admin,'GET')).assignments.find(a=>a.email===leader);await expect('/api/organizers',admin,'DELETE',{id:assignment.id});
await expect('/api/leader',leader,'GET',undefined,403);
await expect('/api/requests/'+a.id,leader,'PATCH',{status:'in_review',note:'Revoked access'},404);
assert.equal((await expect('/api/leader',professor,'GET')).clubs[0].id,'biology');
const initial=await expect('/api/leader','qa-initial@sites.test','GET');assert.deepEqual(initial.clubs.map(c=>c.id),['ambassadors']);
const initialGrant=(await expect('/api/organizers',admin,'GET')).assignments.find(a=>a.email==='qa-initial@sites.test');await expect('/api/organizers',admin,'DELETE',{id:initialGrant.id});
await expect('/api/leader','qa-initial@sites.test','GET',undefined,403);
await expect('/api/leader','qa-initial@sites.test','GET',undefined,403);
console.log('PASS: anonymous rejection, administrator-only assignments, per-club leader/professor queues, cross-club denial, proposal isolation, self-approval rejection, active club privacy, leaving/rejoining, immediate revocation, configured grant scoping and durable revocation. LOCAL isolated database only.');




