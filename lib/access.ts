import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function identity() {
 const user=await getChatGPTUser();
 // Allowlist stays on the server. The development identity is never privileged in production.
 const allow=(process.env.CLUB_HUB_ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
 const admin=!!user&&(allow.includes(user.email.toLowerCase())||(process.env.NODE_ENV==='development'&&user.email==='seedy@sites.test'));
 return {user,admin};
}
export function sameOrigin(request:Request) {
 const origin=request.headers.get('origin');
 return origin!==null&&origin===new URL(request.url).origin;
}
