import {env} from 'cloudflare:workers';
import {clubs} from './clubs';
// Owner-configured initial grants are applied once. A UI revocation is never undone.
export async function syncConfiguredOrganizers(){
 const config=env.CLUB_HUB_BOOTSTRAP_ORGANIZERS;if(!config)return;
 let entries:unknown;try{entries=JSON.parse(config);}catch{throw new Error('Invalid organizer configuration.');}
 if(!Array.isArray(entries)||entries.length>25)throw new Error('Invalid organizer configuration.');
 const db=env.DB!;
 for(const entry of entries){
  if(!entry||typeof entry.email!=='string'||typeof entry.clubId!=='string')throw new Error('Invalid organizer configuration.');
  const email=entry.email.trim().toLowerCase(),clubId=entry.clubId,role=entry.role;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['organizer','professor'].includes(role)||!clubs.some(c=>c.id===clubId&&c.kind==='club'))throw new Error('Invalid organizer configuration.');
  const key=email+'|'+clubId,now=new Date().toISOString();
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO club_organizers (id,club_id,email,role,added_by,created_at) SELECT ?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM configured_grants WHERE key=?)').bind(crypto.randomUUID(),clubId,email,role,'site-owner-configuration',now,key),
   db.prepare('INSERT OR IGNORE INTO configured_grants (key,created_at) VALUES (?,?)').bind(key,now),
  ]);
 }
}
