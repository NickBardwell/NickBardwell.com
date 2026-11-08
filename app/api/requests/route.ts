import { NextResponse } from 'next/server';
import { desc,eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { requests,events } from '@/db/schema';
import { catalogue } from '@/lib/catalogue';
import { categories } from '@/lib/clubs';
import { identity,sameOrigin } from '@/lib/access';
import { validLsuaEmail } from '@/lib/workflow';
export const dynamic='force-dynamic';
export async function GET() {
 const {user,admin}=await identity();
 if(!user||!admin)return NextResponse.json({error:'Reviewer access required.'},{status:403});
 try{return NextResponse.json({requests:await getDb().select().from(requests).orderBy(desc(requests.createdAt))},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Unable to load requests.'},{status:503});}
}
export async function POST(request:Request) {
 if(!sameOrigin(request))return NextResponse.json({error:'Please submit using Club Hub.'},{status:403});
 const {user}=await identity();
 if(!user)return NextResponse.json({error:'Sign in before submitting a request.'},{status:401});
 try {
  const data=await request.json() as Record<string,unknown>;
  const clean=(key:string,max:number)=>typeof data[key]==='string'?(data[key] as string).trim().slice(0,max):'';
  const name=clean('name',100), studentEmail=clean('studentEmail',254).toLowerCase(), message=clean('message',2000), type=clean('type',20);
  if(!name||!validLsuaEmail(studentEmail)||!message||!['application','proposal'].includes(type)||data.consent!==true)return NextResponse.json({error:'Add your name, LSUA email, message, and consent.'},{status:400});
  const clubId=clean('clubId',100),category=clean('category',100),advisor=clean('advisor',200);
  let clubName=clean('clubName',120);
  if(type==='application') {const club=(await catalogue()).find(c=>c.id===clubId);if(!club||club.kind!=='club')return NextResponse.json({error:'Choose a student club.'},{status:400});clubName=club.name;}
  if(type==='proposal'&&(!clubName||!categories.includes(category)))return NextResponse.json({error:'Add a club name and valid category.'},{status:400});
  const id=crypto.randomUUID(),now=new Date().toISOString(),db=getDb();
  const activeKey=type==='application'?user.userId+':'+clubId:null;
  if(activeKey){const existing=await db.select({id:requests.id}).from(requests).where(eq(requests.activeKey,activeKey));if(existing.length)return NextResponse.json({error:'You already have an active application or confirmed membership for this club. Check My requests.'},{status:409});}
  const values={id,activeKey,userId:user.userId,userEmail:user.email,type,clubId:type==='application'?clubId:null,clubName,name,studentEmail,message,category:type==='proposal'?category:null,advisor:type==='proposal'?advisor:null,status:'submitted',createdAt:now,updatedAt:now};
  await db.batch([db.insert(requests).values(values),db.insert(events).values({id:crypto.randomUUID(),requestId:id,actorId:user.userId,status:'submitted',note:type==='proposal'?'Proposal received for review.':'Application received. Membership is not yet confirmed.',createdAt:now})]);
  return NextResponse.json({id,status:'submitted'},{status:201});
 }catch(error){
  let detail:unknown=error;while(detail instanceof Error){if(detail.message.includes('UNIQUE'))return NextResponse.json({error:'You already have an active application or confirmed membership for this club. Check My requests.'},{status:409});detail=detail.cause;}
  return NextResponse.json({error:'Your request was not saved. Please try again.'},{status:503});
 }
}
