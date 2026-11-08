import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { clubSettings } from '@/db/schema';
import { catalogue } from '@/lib/catalogue';
import { identity,sameOrigin } from '@/lib/access';
import { safeJoinUrl } from '@/lib/workflow';
export const dynamic='force-dynamic';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) {
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub.'},{status:403});
 const {user,admin}=await identity();if(!user||!admin)return NextResponse.json({error:'Reviewer access required.'},{status:403});
 try {
  const {id}=await params,club=(await catalogue()).find(c=>c.id===id);
  if(!club||club.kind==='resource')return NextResponse.json({error:'Club not found.'},{status:404});
  const {joinMethod,joinUrl}=await request.json() as {joinMethod:string;joinUrl:string};
  if(!['unconfirmed','self','review'].includes(joinMethod))return NextResponse.json({error:'Enter a valid join method.'},{status:400});
  if(joinMethod==='self'&&!safeJoinUrl(joinUrl||''))return NextResponse.json({error:'Self-join needs an HTTPS Involve or LSUA link.'},{status:400});
  const values={clubId:id,members:null,joinMethod,joinUrl:joinMethod==='self'?joinUrl:null,verifiedAt:new Date().toISOString(),updatedBy:user.userId};
  await getDb().insert(clubSettings).values(values).onConflictDoUpdate({target:clubSettings.clubId,set:values});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Club settings could not be saved.'},{status:503});}
}
