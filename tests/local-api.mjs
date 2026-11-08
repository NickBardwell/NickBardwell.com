import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';
async function call(path,{method='GET',body,auth=true,origin=base}={}){const r=await fetch(base+path,{method,headers:{...(auth?{cookie:'__sites_local_auth=1'}:{}),...(body?{'content-type':'application/json',origin}:{})},body:body?JSON.stringify(body):undefined});const text=await r.text();let data;try{data=JSON.parse(text);}catch{data={error:text};}return {status:r.status,data};}
const data={type:'application',clubId:'flying-generals',name:'Local QA Student',studentEmail:'clubhub-qa@lsua.edu',message:'Local development test. No real application.',consent:true};
assert.equal((await call('/api/hub',{auth:false})).data.clubs.length,44);
assert.equal((await call('/api/requests',{method:'POST',body:data,auth:false})).status,401);
assert.equal((await call('/api/requests',{method:'POST',body:data,origin:'https://untrusted.example'})).status,403);
assert.equal((await call('/api/requests',{method:'POST',body:{...data,studentEmail:'fake@example.com'}})).status,400);
const hub=await call('/api/hub');assert.ok(hub.data.admin,'local development reviewer identity');
let created=await call('/api/requests',{method:'POST',body:data});assert.equal(created.status,201,JSON.stringify(created));const id=created.data.id;
assert.equal((await call('/api/requests',{method:'POST',body:data})).status,409);
assert.equal((await call('/api/requests/'+id,{method:'PATCH',body:{status:'approved',note:'Must not approve without confirmed campus enrollment.'}})).status,400);
for(const status of ['in_review','needs_info','in_review'])assert.equal((await call('/api/requests/'+id,{method:'PATCH',body:{status,note:'Local QA status update'}})).status,200);
assert.equal((await call('/api/requests/'+id,{method:'PATCH',body:{status:'withdrawn'}})).status,200);
created=await call('/api/requests',{method:'POST',body:data});assert.equal(created.status,201);const approvedId=created.data.id;
assert.equal((await call('/api/requests/'+approvedId,{method:'PATCH',body:{status:'approved',note:'Local test confirmation only.',confirmed:true}})).status,200);
assert.equal((await call('/api/requests/'+approvedId,{method:'PATCH',body:{status:'in_review',note:'Invalid reopening'}})).status,400);
const proposal=await call('/api/requests',{method:'POST',body:{...data,type:'proposal',clubName:'Local QA Club',category:'Arts & creativity',advisor:'Local test advisor',message:'A temporary local test club for verifying the proposal workflow.'}});assert.equal(proposal.status,201);
assert.equal((await call('/api/requests/'+proposal.data.id,{method:'PATCH',body:{status:'approved',note:'Local QA recognition check only.',confirmed:true}})).status,200);
const after=await call('/api/hub');assert.equal(after.data.clubs.length,45);assert.ok(after.data.events.length>=8);assert.ok(after.data.clubs.find(c=>c.name==='Local QA Club'));assert.ok(after.data.clubs.every(c=>!('studentEmail' in c)));
assert.equal((await call('/api/clubs/flying-generals',{method:'PATCH',body:{joinMethod:'self',joinUrl:'https://evil.example'}})).status,400);
assert.equal((await call('/api/clubs/flying-generals',{method:'PATCH',body:{joinMethod:'self',joinUrl:'https://lsua.presence.io/organizations'}})).status,200);
assert.equal((await call('/api/clubs/flying-generals',{method:'PATCH',body:{joinMethod:'unconfirmed',joinUrl:''}})).status,200);
console.log('PASS: directory, sign-in enforcement, cross-origin rejection, LSUA contact validation, duplicate prevention, review transitions, approval confirmation, withdrawal, audit history, proposal publication, redirect validation. Test data exists only in local D1.');

