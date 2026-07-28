import { brochuresByCourseId, type CourseBrochure } from "@/data/brochures";

export const universityNames = [
  "Lovely Professional University Online",
  "Manipal University",
  "ARKA JAIN University Online",
  "Dr. D. Y. Patil Vidyapeeth Online",
  "Jain University",
  "Sharda University Online",
  "Shoolini University Online",
] as const;
export type University = (typeof universityNames)[number];
export type CourseCategory = "Undergraduate" | "Postgraduate" | "Integrated" | "Certification";
export type Course = {
  id: string;
  title: string;
  university: University;
  category: CourseCategory;
  description: string;
  duration: string;
  brochures: CourseBrochure[];
};
type Seed = Omit<Course, "university" | "description" | "brochures">;
const make = (university: University, programs: Seed[]): Course[] =>
  programs.map((program) => ({
    ...program,
    university,
    description: `${program.title} is a flexible online program from ${university}, designed to build practical, career-relevant knowledge while allowing learners to study from anywhere.`,
    brochures: brochuresByCourseId[program.id] ?? [],
  }));
const ug = (id: string, title: string, duration = "3 Years • Online"): Seed => ({ id, title, category: "Undergraduate", duration });
const pg = (id: string, title: string, duration = "2 Years • Online"): Seed => ({ id, title, category: "Postgraduate", duration });
const cert = (id: string, title: string, duration: string): Seed => ({ id, title, category: "Certification", duration });
const integrated = (id: string, title: string, duration: string): Seed => ({ id, title, category: "Integrated", duration });

const lpu: Seed[] = [
  ug("lpu-bba", "Bachelor of Business Administration (BBA)"), ug("lpu-bca", "Bachelor of Computer Applications (BCA)"), cert("lpu-dca", "Diploma in Computer Applications (DCA)", "1 Year • Online"),
  pg("lpu-ma", "Master of Arts (MA)"), pg("lpu-ma-history", "Master of Arts in History"), pg("lpu-ma-sociology", "Master of Arts in Sociology"), pg("lpu-ma-political-science", "Master of Arts in Political Science"), pg("lpu-msc-economics", "Master of Science in Economics"), pg("lpu-msc-mathematics", "Master of Science in Mathematics"),
  pg("lpu-mba", "Master of Business Administration (MBA)"), pg("lpu-mba-hr", "MBA in Human Resource Management"), pg("lpu-mba-finance", "MBA in Finance"), pg("lpu-mba-marketing", "MBA in Marketing"), pg("lpu-mba-operations", "MBA in Operations Management"), pg("lpu-mba-business-analytics", "MBA in Business Analytics"), pg("lpu-mba-digital-marketing", "MBA in Digital Marketing"), pg("lpu-mba-data-science", "MBA in Data Science"), pg("lpu-mba-information-technology", "MBA in Information Technology"), pg("lpu-mba-international-business", "MBA in International Business"), pg("lpu-mba-healthcare", "MBA in Hospital & Healthcare Management"), pg("lpu-mba-logistics", "MBA in Logistics & Supply Chain Management"), pg("lpu-mba-banking", "MBA in Banking & Financial Services"),
  pg("lpu-mca", "Master of Computer Applications (MCA)"), pg("lpu-mca-ml-ai", "MCA in Machine Learning & Artificial Intelligence"), pg("lpu-mca-data-science", "MCA in Data Science"), pg("lpu-mca-cyber-security", "MCA in Cyber Security"), pg("lpu-mca-full-stack", "MCA in Full Stack Web Development"), pg("lpu-mca-ar-vr", "MCA in AR/VR (Game Development)"),
];
const muj: Seed[] = [ug("muj-bca", "Bachelor of Computer Applications (BCA)"), ug("muj-bcom", "Bachelor of Commerce (BCom)"), pg("muj-ma-economics", "Master of Arts in Economics"), pg("muj-majmc", "Master of Arts in Journalism & Mass Communication"), pg("muj-mba", "Master of Business Administration (MBA)"), pg("muj-mca", "Master of Computer Applications (MCA)"), pg("muj-mcom", "Master of Commerce (MCom)"), pg("muj-msc-mathematics", "Master of Science in Mathematics")];
const smu: Seed[] = [ug("smu-ba", "Bachelor of Arts (BA)"), ug("smu-bcom", "Bachelor of Commerce (BCom)"), pg("smu-ma", "Master of Arts (MA)"), pg("smu-ma-english", "Master of Arts in English"), pg("smu-ma-political-science", "Master of Arts in Political Science"), pg("smu-ma-sociology", "Master of Arts in Sociology"), pg("smu-mba", "MBA with Dual Specialization"), pg("smu-mca", "Master of Computer Applications (MCA)"), pg("smu-mcom", "Master of Commerce (MCom)")];
const aju: Seed[] = [ug("aju-bba", "Bachelor of Business Administration (BBA)"), ug("aju-bca", "Bachelor of Computer Applications (BCA)"), ug("aju-bcom", "Bachelor of Commerce (BCom)"), pg("aju-mba", "Master of Business Administration (MBA)"), pg("aju-mca", "Master of Computer Applications (MCA)")];
const dpu: Seed[] = [
  ug("dpu-bba", "Bachelor of Business Administration (BBA)"), ug("dpu-bba-marketing", "BBA in Marketing Management"), ug("dpu-bba-finance", "BBA in Finance Management"), ug("dpu-bba-retail", "BBA in Retail Management"), ug("dpu-bba-ecommerce", "BBA in E-Commerce Management"), ug("dpu-bba-logistics", "BBA in Shipping & Logistics Management"), ug("dpu-bba-hr", "BBA in Human Resource Management"), ug("dpu-bba-it", "BBA in IT & Systems Management"), ug("dpu-bba-international-business", "BBA in International Business Management"), ug("dpu-bba-bfsi", "BBA in Banking, Financial Services & Insurance Management"),
  pg("dpu-mba", "Master of Business Administration (MBA)"), pg("dpu-mba-marketing", "MBA in Marketing Management"), pg("dpu-mba-fintech", "MBA in FinTech Management"), pg("dpu-mba-operations", "MBA in Operations Management"), pg("dpu-mba-agribusiness", "MBA in Agribusiness Management"), pg("dpu-mba-blockchain", "MBA in Blockchain Management"), pg("dpu-mba-project", "MBA in Project Management"), pg("dpu-mba-finance", "MBA in Finance Management"), pg("dpu-mba-hr", "MBA in Human Resource Management"), pg("dpu-mba-it", "MBA in IT Management"), pg("dpu-mba-business-analytics", "MBA in Business Analytics Management"), pg("dpu-mba-international-business", "MBA in International Business Management"), pg("dpu-mba-ai-ml", "MBA in Artificial Intelligence & Machine Learning"), pg("dpu-mba-digital-marketing", "MBA in Digital Marketing Management"), pg("dpu-mba-logistics", "MBA in Logistics, Materials & Supply Chain Management"), pg("dpu-mba-healthcare", "MBA in Hospital & Healthcare Administration"),
  pg("dpu-mca", "Master of Computer Applications (MCA)"), pg("dpu-mca-ai-ml", "MCA in Artificial Intelligence & Machine Learning"), pg("dpu-mca-blockchain", "MCA in Blockchain Technology"), pg("dpu-mca-business-analytics", "MCA in Business Analytics"), pg("dpu-mca-digital-marketing", "MCA in Digital Marketing"), pg("dpu-mca-fintech", "MCA in FinTech"),
  cert("dpu-cert-digital-marketing", "Certificate in Digital Marketing", "6 Months • Online"), cert("dpu-cert-healthcare", "Certificate in Hospital & Healthcare Management", "6 Months • Online"),
];
const jain: Seed[] = [
  pg("mba-jain", "MBA - Digital Business & Strategy", "2 Years • Full-time • Hybrid"),
  cert("cert-product-jain", "Certification in Product Management", "6 Months • Part-time • Online"),
];
const sharda: Seed[] = [ug("bba-sharda-online", "BBA - Online Business Administration", "3 Years • Online • Flexible")];
const shoolini: Seed[] = [
  ug("shoolini-bba", "Bachelor of Business Administration (BBA)"),
  ug("shoolini-bca", "Bachelor of Computer Applications (BCA)"),
  ug("shoolini-bcom-hons", "Bachelor of Commerce (Honours)"),
  ug("shoolini-ba-distance", "Bachelor of Arts (BA)", "3 Years • Distance"),
  pg("shoolini-mba", "Master of Business Administration (MBA)"),
  pg("shoolini-mba-premium", "Master of Business Administration Premium"),
  pg("shoolini-mca", "Master of Computer Applications (MCA)"),
  pg("shoolini-msc-data-science", "Master of Science in Data Science"),
  pg("shoolini-ma-english-literature", "Master of Arts in English Literature"),
  pg("shoolini-ma-journalism-mass-communication", "Master of Arts in Journalism & Mass Communication"),
];
const manipalLegacy: Seed[] = [
  ug("btech-manipal", "B.Tech - Computer Science & Engineering", "4 Years • Full-time • On-campus"),
  pg("mca-manipal", "MCA - Advanced Software Systems", "2 Years • Full-time • Hybrid"),
  integrated("integrated-tech-management-manipal", "Integrated B.Tech + MBA in Technology Management", "5 Years • Full-time • On-campus"),
  cert("cert-ai-manipal", "Certification in Applied AI & ML", "9 Months • Part-time • Online"),
  pg("manipal-pg-mba-gen", "Master of Business Administration"),
  ug("manipal-ug-bba-gen", "Bachelor of Business Administration"),
  ug("manipal-ug-bca-gen", "Bachelor of Computer Application"),
  pg("manipal-pg-mca-gen", "Master of Computer Application"),
  ug("manipal-ug-bcom-gen", "Bachelor of Commerce"),
  pg("manipal-pg-ma-economics", "Master of Arts in Economics"),
  pg("manipal-pg-mcom-gen", "Master of Commerce"),
  pg("manipal-pg-ma-journalism", "Master of Arts in Journalism and Mass Communication"),
  pg("manipal-pg-ma-english", "Master of Arts in English"),
  pg("manipal-pg-ma-political-science", "Master of Arts in Political Science"),
  pg("manipal-pg-ma-sociology", "Master of Arts in Sociology"),
];

export const courses: Course[] = [
  ...make("Lovely Professional University Online", lpu),
  ...make("Manipal University", muj),
  ...make("Manipal University", smu),
  ...make("ARKA JAIN University Online", aju),
  ...make("Dr. D. Y. Patil Vidyapeeth Online", dpu),
  ...make("Jain University", jain),
  ...make("Sharda University Online", sharda),
  ...make("Shoolini University Online", shoolini),
  ...make("Manipal University", manipalLegacy),
];



