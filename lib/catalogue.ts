import { and,eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { requests,clubSettings } from '@/db/schema';
import { mergeClubs, type Club } from './clubs';
export async function catalogue():Promise<Club[]> {
 const db=getDb(), settings=await db.select().from(clubSettings);
 const approved=await db.select({id:requests.id,name:requests.clubName,category:requests.category,description:requests.message}).from(requests).where(and(eq(requests.type,'proposal'),eq(requests.status,'approved')));
 const added:Club[]=approved.map(p=>({id:'new-'+p.id,name:p.name,category:p.category||'Leadership & service',description:p.description,icon:'sparkles',kind:'club',website:null,source:'Proposal approved by Club Hub reviewer; see Student Life for official records',verified:false,joinMethod:'review',members:null}));
 return [...mergeClubs(settings),...added].map(c=>{const s=settings.find(s=>s.clubId===c.id);return s?{...c,members:s.members,joinMethod:s.joinMethod as Club['joinMethod'],joinUrl:s.joinUrl||undefined}:c;});
}
