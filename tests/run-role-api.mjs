import {Miniflare} from 'miniflare';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/server');
function modules(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?modules(path.join(dir,e.name)):e.name.endsWith('.js')?[{type:'ESModule',path:path.join(dir,e.name)}]:[]);}
fs.mkdirSync('work',{recursive:true});const testState=fs.mkdtempSync(path.resolve('work/role-test-'));
const mf=new Miniflare({d1Persist:testState,modules:modules(root),modulesRoot:root,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{CLUB_HUB_ADMIN_EMAILS:'qa-admin@sites.test',CLUB_HUB_BOOTSTRAP_ORGANIZERS:JSON.stringify([{email:'qa-initial@sites.test',clubId:'ambassadors',role:'organizer'}])}});
try{
 const db=await mf.getD1Database('DB');
 for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort().map(f=>'drizzle/'+f))for(const sql of fs.readFileSync(file,'utf8').split('--> statement-breakpoint').filter(s=>s.trim()))await db.prepare(sql).run();
 globalThis.roleFetch=(url,options)=>mf.dispatchFetch(url,options);
 await import('./role-api.mjs');
}finally{await mf.dispose();}


