import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { requests,events } from '@/db/schema';
import { catalogue } from '@/lib/catalogue';
import { identity } from '@/lib/access';
export const dynamic='force-dynamic';
export async function GET() {
 try {
  const {user,admin}=await identity(), db=getDb();
  const mine=user?await db.select().from(requests).where(eq(requests.userId,user.userId)).orderBy(desc(requests.createdAt)):[];
  const history=user?await db.select({id:events.id,requestId:events.requestId,status:events.status,note:events.note,createdAt:events.createdAt}).from(events).innerJoin(requests,eq(events.requestId,requests.id)).where(eq(requests.userId,user.userId)).orderBy(desc(events.createdAt)):[];
  return NextResponse.json({clubs:await catalogue(),user:user?{name:user.displayName,email:user.email}:null,admin,requests:mine,events:history},{headers:{'Cache-Control':'private, no-store'}});
 }catch {return NextResponse.json({error:'Live requests are temporarily unavailable. You can still browse the directory.'},{status:503});}
}
