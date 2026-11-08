import {NextResponse} from 'next/server';
import {getDb} from '@/db';
import {organizers} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {identity,sameOrigin} from '@/lib/access';
import {catalogue} from '@/lib/catalogue';
import {syncConfiguredOrganizers} from '@/lib/configured-organizers';
export const dynamic='force-dynamic';
export async function GET(){const {user,admin}=await identity();if(!user||!admin)return NextResponse.json({error:'Administrator access required.'},{status:403});try{await syncConfiguredOrganizers();return NextResponse.json({assignments:await getDb().select().from(organizers)},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Unable to load organizer assignments.'},{status:503});}}
export async function POST(request:Request){
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub.'},{status:403});
 const {user,admin}=await identity();if(!user||!admin)return NextResponse.json({error:'Only an administrator can assign club representatives.'},{status:403});
 try{const body=await request.json() as Record<string,unknown>;const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';const clubId=String(body.clubId||''),role=String(body.role||'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!['organizer','professor'].includes(role))return NextResponse.json({error:'Enter a valid sign-in email and representative role.'},{status:400});
 const club=(await catalogue()).find(c=>c.id===clubId&&c.kind==='club');if(!club)return NextResponse.json({error:'Choose a club.'},{status:400});
 const values={id:crypto.randomUUID(),clubId,email,role,addedBy:user.userId,createdAt:new Date().toISOString()};
 await getDb().insert(organizers).values(values).onConflictDoUpdate({target:[organizers.clubId,organizers.email],set:{role,addedBy:user.userId,createdAt:values.createdAt}});
 return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Assignment was not saved. Please try again.'},{status:503});}
}
export async function DELETE(request:Request){
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub.'},{status:403});
 const {user,admin}=await identity();if(!user||!admin)return NextResponse.json({error:'Administrator access required.'},{status:403});
 try{const {id}=await request.json() as {id:string};if(!id)return NextResponse.json({error:'Choose an assignment.'},{status:400});await getDb().delete(organizers).where(eq(organizers.id,id));return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to remove assignment.'},{status:503});}
}
