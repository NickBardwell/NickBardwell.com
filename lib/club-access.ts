import {and,eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {organizers} from '@/db/schema';
import {syncConfiguredOrganizers} from './configured-organizers';
export async function assignedClubs(email:string){await syncConfiguredOrganizers();return getDb().select().from(organizers).where(eq(organizers.email,email.trim().toLowerCase()));}
export async function canReviewClub(email:string,clubId:string|null,admin:boolean){
 if(admin)return true;if(!clubId)return false;
 await syncConfiguredOrganizers();
 const rows=await getDb().select({id:organizers.id}).from(organizers).where(and(eq(organizers.email,email.trim().toLowerCase()),eq(organizers.clubId,clubId)));
 return rows.length>0;
}
