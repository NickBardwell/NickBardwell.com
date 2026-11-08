import {NextResponse} from 'next/server';
import {and,eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {memberships} from '@/db/schema';
import {identity} from '@/lib/access';
import {catalogue} from '@/lib/catalogue';
export const dynamic='force-dynamic';
export async function GET(){const {user}=await identity();if(!user)return NextResponse.json({error:'Sign in to view your active clubs.'},{status:401});try{const rows=await getDb().select().from(memberships).where(and(eq(memberships.userId,user.userId),eq(memberships.status,'active'))),all=await catalogue();return NextResponse.json({memberships:rows.map(m=>({id:m.id,clubId:m.clubId,since:m.createdAt,club:all.find(c=>c.id===m.clubId)||null}))},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Unable to load active clubs.'},{status:503});}}
