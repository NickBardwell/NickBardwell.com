import {NextResponse} from 'next/server';
import {eq} from 'drizzle-orm';
import {env} from 'cloudflare:workers';
import {getDb} from '@/db';
import {memberships} from '@/db/schema';
import {identity,sameOrigin} from '@/lib/access';
export const dynamic='force-dynamic';
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub.'},{status:403});const {user}=await identity();if(!user)return NextResponse.json({error:'Sign in first.'},{status:401});
 try{const {id}=await params;const [m]=await getDb().select().from(memberships).where(eq(memberships.id,id));if(!m||m.userId!==user.userId)return NextResponse.json({error:'Membership not found.'},{status:404});
 await env.DB!.batch([env.DB!.prepare('UPDATE memberships SET status=? WHERE id=? AND user_id=?').bind('inactive',id,user.userId),env.DB!.prepare('UPDATE requests SET active_key=NULL WHERE club_id=? AND user_id=? AND status=?').bind(m.clubId,user.userId,'approved')]);
 return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to update membership.'},{status:503});}
}
