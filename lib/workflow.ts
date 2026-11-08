export const statuses = ['submitted','in_review','needs_info','approved','rejected','withdrawn'] as const;
export type Status = typeof statuses[number];
export const statusLabels: Record<string,string> = {submitted:'Submitted',in_review:'Under review',needs_info:'More information needed',approved:'Approved',rejected:'Not approved',withdrawn:'Withdrawn'};
export function validTransition(from:string,to:string,admin:boolean):boolean {
 if(admin) return ({submitted:['in_review','needs_info','approved','rejected'],in_review:['needs_info','approved','rejected'],needs_info:['in_review','approved','rejected']} as Record<string,string[]>)[from]?.includes(to)??false;
 return (['submitted','in_review','needs_info'].includes(from)&&to==='withdrawn')||(from==='needs_info'&&to==='in_review');
}
export function validLsuaEmail(email:string) {return /^[^\s@]+@lsua\.edu$/i.test(email);}
export function safeJoinUrl(raw:string):boolean {
 try {const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password&&(u.hostname==='lsua.presence.io'||u.hostname==='lsua.edu'||u.hostname.endsWith('.lsua.edu'));} catch{return false;}
}
