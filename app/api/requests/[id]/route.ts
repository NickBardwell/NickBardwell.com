import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { requests } from '@/db/schema';
import { identity,sameOrigin } from '@/lib/access';
import { validTransition } from '@/lib/workflow';
export const dynamic='force-dynamic';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) {
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub.'},{status:403});
 const {user,admin}=await identity();if(!user)return NextResponse.json({error:'Please sign in.'},{status:401});
 try {
  const {id}=await params;
  const [current]=await getDb().select().from(requests).where(eq(requests.id,id));
  if(!current||(!admin&&current.userId!==user.userId))return NextResponse.json({error:'Request not found.'},{status:404});
  const body=await request.json() as Record<string,unknown>,status=String(body.status||''),note=typeof body.note==='string'?body.note.trim().slice(0,1500):'';
  if(status==='withdrawn'&&current.userId!==user.userId)return NextResponse.json({error:'Only the applicant can withdraw a request.'},{status:403});
  if(!validTransition(current.status,status,admin&&status!=='withdrawn'))return NextResponse.json({error:'This status change is not available.'},{status:400});
  if(admin&&status!=='withdrawn'&&!note)return NextResponse.json({error:'Add a note for the student.'},{status:400});
  if(status==='approved'&&body.confirmed!==true)return NextResponse.json({error:current.type==='proposal'?'Confirm Student Life recognition before approving.':'Confirm membership has been recorded in Involve before approving.'},{status:400});
  if(!admin&&status==='in_review'&&!note)return NextResponse.json({error:'Add the requested information before replying.'},{status:400});
  const now=new Date().toISOString(),noteText=status==='withdrawn'?'Student withdrew this request.':note,db=env.DB!;
  const batch=[db.prepare('UPDATE requests SET status=?, reviewer_note=?, updated_at=?, active_key=? WHERE id=? AND status=? AND updated_at=?').bind(status,noteText,now,['rejected','withdrawn'].includes(status)?null:current.activeKey,id,current.status,current.updatedAt),
   db.prepare('INSERT INTO request_events (id,request_id,actor_id,status,note,created_at) SELECT ?,id,?,?,?,? FROM requests WHERE id=? AND updated_at=?').bind(crypto.randomUUID(),user.userId,status,noteText,now,id,now)];
  if(status==='approved'&&current.type==='application')batch.push(db.prepare('INSERT OR IGNORE INTO memberships (id,club_id,user_id,created_at) SELECT ?,club_id,user_id,? FROM requests WHERE id=? AND status=? AND updated_at=?').bind(crypto.randomUUID(),now,id,'approved',now));
  const result=await db.batch(batch);
  if(!result[0].meta.changes)return NextResponse.json({error:'This request changed. Refresh and try again.'},{status:409});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'The update was not saved. Please try again.'},{status:503});}
}
