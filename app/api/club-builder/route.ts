import { NextResponse } from 'next/server';
import { env } from 'cloudflare:workers';
import { identity,sameOrigin } from '@/lib/access';

export const dynamic='force-dynamic';

type BuilderInput={name?:unknown;purpose?:unknown;members?:unknown;activities?:unknown;category?:unknown;advisor?:unknown;};
const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max):'';

export async function POST(request:Request) {
 if(!sameOrigin(request))return NextResponse.json({error:'Please use Club Hub to create a plan.'},{status:403});
 const {user}=await identity();
 if(!user)return NextResponse.json({error:'Sign in to use Club Builder.'},{status:401});
 if(!env.OPENAI_API_KEY)return NextResponse.json({error:'Club Builder is not configured yet. Ask the site administrator to add the OPENAI_API_KEY secret.'},{status:503});
 try {
  const data=await request.json() as BuilderInput;
  const name=clean(data.name,120),purpose=clean(data.purpose,1600),members=clean(data.members,500),activities=clean(data.activities,900),category=clean(data.category,100),advisor=clean(data.advisor,200);
  if(!name||!purpose)return NextResponse.json({error:'Add a club name and a short description of its purpose.'},{status:400});
  const input=`Club name: ${name}\nPurpose: ${purpose}\nWho it serves: ${members||'Not provided'}\nPotential activities: ${activities||'Not provided'}\nCategory: ${category||'Not provided'}\nPotential advisor: ${advisor||'Not provided'}`;
  const response=await fetch('https://api.openai.com/v1/responses',{
   method:'POST',
   headers:{'Content-Type':'application/json','Authorization':`Bearer ${env.OPENAI_API_KEY}`},
   body:JSON.stringify({
    model:'gpt-6-astra',store:false,
    tools:[{type:'web_search'}],
    instructions:'You are the LSUA Club Builder. Help a student prepare a realistic, student-led organization proposal for LSU Alexandria. Use public web research only to verify current LSUA, Student Life, and Involve context. Do not invent LSUA rules, deadlines, contacts, partnerships, recognition status, or sources. Write in clear, encouraging language. Return Markdown with these exact sections: Club pledge, Why it matters at LSUA, First-semester startup plan, First meeting agenda, Officer roles, Advisor outreach, Recognition checklist, and Sources. The pledge should be a short original statement, not an official university policy. In Sources, include only URLs actually used in the research.',
    input,
   }),
  });
  const result=await response.json() as {output_text?:string;error?:{message?:string}};
  if(!response.ok||!result.output_text)return NextResponse.json({error:result.error?.message||'Club Builder could not create a plan. Please try again.'},{status:502});
  return NextResponse.json({plan:result.output_text},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Club Builder could not create a plan. Please try again.'},{status:503});}
}

