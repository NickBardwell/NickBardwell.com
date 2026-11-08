export type Club = {
  id: string; name: string; category: string; description: string; icon: string;
  kind: 'club' | 'resource'; website: string | null; source: string;
  verified: boolean; joinMethod: 'unconfirmed' | 'self' | 'review';
  members: number | null; joinUrl?: string;
};

export const categories = ['Greek life & honors', 'Academic & professional', 'Education & innovation', 'Arts & creativity', 'Leadership & service', 'Campus resources'];
const liberal = 'https://www.lsua.edu/academics/colleges/college-of-liberal-arts/';
const science = 'https://www.lsua.edu/academics/colleges/college-of-science-technology-and-mathematics/';
const social = 'https://lsua.edu/academics/colleges/college-of-social-sciences/';
const business = 'https://www.lsua.edu/academics/colleges/college-of-business/';
const education = 'https://lsua.edu/academics/programs/bachelor-of-science-in-elementary-education/';
const kinesiology = 'https://www.lsua.edu/academics/programs/bachelor-of-general-studies-with-concentration-in-kinesiology/';
// Membership totals and enrollment methods must be verified by a reviewer, never inferred.
const entries: [string, string, number, string, string, string | null, boolean?, boolean?][] = [
 ['alpha-kappa-eta','Alpha Kappa Eta',0,'A Greek-letter organization described in the supplied reference as supporting fellowship, academics, leadership, and campus involvement. Its exact identity, affiliation, and current activities need confirmation.','laurel',null],
 ['gamma-lambda-tau','Gamma Lambda Tau',0,'Connects Medical Laboratory Science students and promotes interest in laboratory science and phlebotomy through professional awareness and student interaction.','microscope','https://www.lsua.edu/academics/programs/associate-of-science---medical-laboratory-science/',true],
 ['kappa-sigma','Kappa Sigma · Pi-Alpha',0,'A men’s social fraternity emphasizing brotherhood, scholarship, leadership, personal development, and service to the university and community. Local chapter status needs confirmation.','shield',null],
 ['nsls','National Society of Leadership and Success',0,'A collegiate leadership honor society offering goal setting, leadership development, speaker programs, and opportunities to build professional and peer networks.','award',null],
 ['npc','NPC Greek Life',0,'The sorority community associated with the National Panhellenic Conference supports recruitment, scholarship, sisterhood, leadership, and philanthropy. Its specific campus role needs confirmation.','flower',null],
 ['phi-epsilon-kappa','Phi Epsilon Kappa · Iota Theta',0,'LSUA’s kinesiology honor society recognizes academic achievement in kinesiology and related fields.','medal',kinesiology,true],
 ['phi-mu','Phi Mu',0,'A national women’s fraternity promoting sisterhood, academic achievement, leadership, service, and personal growth. The local chapter’s current status needs confirmation.','flower',null],
 ['sigma-tau-delta','Sigma Tau Delta',0,'An international English honor society encouraging scholarship, literary activities, creative writing, and connections among students interested in language and literature.','feather',null],
 ['zeta-phi-beta','Zeta Phi Beta Sorority, Inc.',0,'A historically Black sorority centered on scholarship, service, sisterhood, and finer womanhood, with opportunities for leadership and community involvement.','heart',null],
 ['accounting','Accounting Club',1,'Promotes accounting study and professional development while connecting students with practicing professionals. Members also develop a commitment to service and ethical responsibility.','calculator',business,true],
 ['amsa','American Medical Student Association',1,'Supports, informs, and inspires students preparing for medical careers and seeking to make a difference through medicine.','stethoscope',science,true],
 ['biology','Biological Science Organization',1,'Brings students interested in biology together for scientific exploration, academic development, and connections with other life-science students.','dna',null],
 ['chemistry','Chemistry Club',1,'Connects students interested in chemistry and scientific learning. Students do not need to be chemistry majors or have taken science classes to join.','flask',science,true],
 ['computer-science','Computer Science Club',1,'A community for students interested in programming, computing, cybersecurity, and emerging technology, with opportunities for collaboration and skill development.','code',null],
 ['criminal-justice','Criminal Justice Association',1,'A student organization for LSUA criminal justice majors and minors to connect around their shared field of study.','scale',social,true],
 ['dental-hygiene','Dental Hygiene',1,'A group described in the supplied reference as supporting dental hygiene education, professional preparation, oral-health outreach, and peer connections.','smile',null],
 ['allied-health','Department of Allied Health',1,'An academic department supporting healthcare education and career preparation, including program guidance and clinical learning opportunities. It is a campus resource rather than a membership club.','cross',null,false,true],
 ['flying-generals','Flying Generals',1,'Brings aviation enthusiasts together to support current and future aviation students and encourage aviation careers. Students from any LSUA major are welcome.','plane','https://www.lsua.edu/aviation',true],
 ['kinesiology','Kinesiology Club',1,'Promotes healthy living, community service, networking, leadership, and professional preparation for kinesiology students.','activity',kinesiology,true],
 ['nursing','LSUA Nursing Club',1,'Supports nursing students through peer connections, healthcare education, leadership, service, and preparation for professional practice.','stethoscope',null],
 ['math','Math Club · Lambda Tau Chi',1,'Connects students interested in mathematics through collaboration, problem solving, competitions, and exploration of real-world applications.','sigma',science,true],
 ['psychology','Psychology Club',1,'Brings together students interested in discussing the theory and practice of psychology.','brain',social,true],
 ['stem','STEM Skills Seminar',1,'A skills-focused academic initiative described as developing STEM, problem-solving, communication, and teamwork skills. Its exact format and availability need confirmation.','atom',null,false,true],
 ['srta','Student Radiologic Technology Association',1,'Promotes interest in radiology, supports attendance at professional seminars and conventions, and increases public awareness through community involvement. This description is based on an older LSUA catalog.','scan','https://www.lsua.edu/docs/default-source/academics/catalogs/2017-2018-lsua-catalog_b.pdf?sfvrsn=6b843e2e_6',true],
 ['career','Command Your Career',2,'Helps students explore careers, develop professional skills, gain experience, and prepare for employment. Students complete milestones toward becoming a Four-Star Graduate.','briefcase','https://www.lsua.edu/about/career-success/command-your-career/',true,true],
 ['educators-rising','Educators Rising Collegiate Club',2,'Connects future educators with one another and with LSUA’s Education Department.','graduation',education,true],
 ['lsua-1001','LSUA 1001 Classes',2,'A freshman academic-success course introducing campus resources, study strategies, community involvement, and service learning with support from a professor and peer mentor.','book','https://www.lsua.edu/student-engagement/first-year-experience/',true,true],
 ['apel','Associated Professional Educators of Louisiana',2,'Connects aspiring educators with a professional organization offering development, classroom resources, and advocacy for Louisiana teachers. LSUA uses the abbreviation A+PEL.','presentation',education,true],
 ['tec','T.E.C. Guild',2,'A multidisciplinary community described as bringing together students interested in technology, entrepreneurship, design, and creative projects. LSUA-specific activities need confirmation.','lightbulb',null],
 ['technovation','Technovation',2,'An LSUA innovation initiative providing spaces such as the Makerspace and Cybersecurity Center where students explore technology and develop hands-on skills.','rocket','https://www.lsua.edu/academics/academic-affairs/',true,true],
 ['museum','Alexandria Museum of Art',3,'An LSUA-affiliated museum offering art exhibitions, workshops, lectures, concerts, and community programs that connect people with art and creative learning.','palette','https://themuseum.org/mission-history/',true,true],
 ['media','LSUA Media',3,'A student-operated team supporting university marketing and communications while giving students practical experience with creative media projects and professional guidance.','camera',liberal,true],
 ['art-league','Student Art League',3,'Helps students connect with other creative people, develop artistic expression, and explore new ways of making art.','brush',liberal,true],
 ['second-act','The Second Act',3,'This organization’s exact purpose and current status have not been verified at LSUA or LSU. LSUA lists Empty Space Players as a theater troupe, but a connection between the two names has not been established.','theater',null],
 ['circle-k','Circle K International at LSUA',4,'Provides community-service opportunities and educational meetings, with sponsorship from the Kiwanis Club of Alexandria.','handshake','https://k02149.site.kiwanis.org/',true],
 ['core','CORE',4,'The Center for Opportunity Research & Experiential Learning supports undergraduate research, creative scholarship, and hands-on learning through showcases, publications, grants, and other opportunities.','search','https://www.lsua.edu/about/career-success/core/',true,true],
 ['ambassadors','LSUA Ambassadors',4,'Student representatives who lead orientation, give campus tours, help incoming students adjust to college, and represent LSUA at recruitment and community events.','megaphone','https://www.lsua.edu/student-engagement/first-year-experience/ambassadors/',true],
 ['rotaract','Rotaract',4,'Develops leadership, community service, responsible citizenship, networking, and global awareness, with sponsorship from the Alexandria Rotary Club.','globe',business,true],
 ['government','Student Government',4,'Represents student concerns to faculty and administrators and advocates on issues such as academics, parking, transportation, and student support. Members also help shape university policies.','landmark','https://www.lsua.edu/student-engagement/campus-life/student-government/about/',true],
 ['turning-point','Turning Point USA',4,'LSU’s Baton Rouge chapter promotes freedom, free markets, and limited government through discussions, free-speech activities, and guest speakers. This is LSU fallback information; LSUA-specific activities and status are unconfirmed.','flag','https://tigerlink.lsu.edu/tpusaatlsu/home/'],
 ['library','Bolton Library',5,'Provides research materials, librarian assistance, study spaces, computers, and printing, along with access to tutoring and a Makerspace.','library','https://www.lsua.edu/library/',true,true],
 ['title-ix','LSUA Title IX',5,'Addresses discrimination, harassment, and sexual misconduct concerns while providing reporting options, education, and support resources. Use the office’s website for sensitive concerns rather than a Club Hub form.','shield','https://www.lsua.edu/student-engagement/student-support/title-ix/',true,true],
 ['oaks','Oaks Housing',5,'Provides campus housing, residential activities, and support from staff and resident assistants who help with campus resources and residential concerns.','home','https://lsua.edu/student-engagement/the-oaks/residential-life/',true,true],
 ['student-life','Student Life',5,'Coordinates campus events and supports student organizations, helping students make connections, develop leadership skills, and get involved outside the classroom.','users','https://www.lsua.edu/student-engagement/campus-life/',true,true],
];

export const clubs: Club[] = entries.map(([id,name,category,description,icon,website,verified,resource]) => ({
  id,name,category:categories[category],description,icon,website,
  kind:resource?'resource':'club',verified:!!verified,
  source:verified?'University or organization reference':id==='turning-point'?'LSU Baton Rouge fallback':'Supplied student reference · needs confirmation',
  joinMethod:'unconfirmed',members:null,
}));

export type ClubOverride = {clubId:string; members:number|null; joinMethod:string; joinUrl:string|null; verifiedAt:string;};
export function mergeClubs(overrides:ClubOverride[]=[]): Club[] {
  return clubs.map(c=>{const o=overrides.find(o=>o.clubId===c.id);return o?{...c,members:o.members,joinMethod:o.joinMethod as Club['joinMethod'],joinUrl:o.joinUrl||undefined}:c;});
}
export function sortClubs(items:Club[],order='members') {
 return [...items].sort((a,b)=> order==='name'?a.name.localeCompare(b.name):
   (a.members===null&&b.members!==null?1:a.members!==null&&b.members===null?-1:
   (b.members??0)-(a.members??0)||a.name.localeCompare(b.name)));
}
