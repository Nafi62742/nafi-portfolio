import { WorkstationI18n, WORKSTATION_I18N } from '@pages/workstation/i18n/workstation.i18n';

/**
 * Schema defining the structure of translation dictionary files.
 */
export interface TranslationSchema {
  nav: {
    home:         string;
    about:        string;
    skills:       string;
    experience:   string;
    projects:     string;
    runmate:      string;
    publications: string;
    education:    string;
    contact:      string;
    resume:       string;
  };
  hero: {
    greeting:     string;
    name:         string;
    role:         string;
    roles:        Array<string>;
    tagline:      string;
    tagline_prefix: string;
    tagline_web:    string;
    tagline_mobile: string;
    tagline_cloud:  string;
    location:       string;
    cta_projects: string;
    cta_contact:  string;
    cta_resume:   string;
    scroll_hint:  string;
  };
  about: {
    section_label:      string;
    title:              string;
    bio_1:              string;
    bio_2:              string;
    bio_3:              string;
    stat_exp:           string;
    stat_projects:      string;
    stat_databases:     string;
    stat_devops:        string;
    stat_exp_sub:       string;
    stat_projects_sub:  string;
    stat_databases_sub: string;
    stat_devops_sub:    string;
    quick_facts_title:  string;
    role_label:         string;
    role_val:           string;
    location_label:     string;
    location_val:       string;
    education_label:    string;
    education_val:      string;
    focus_label:        string;
    focus_val:          string;
    status_active:      string;
  };
  skills: {
    section_label: string;
    title:         string;
    subtitle:      string;
    cat_mobile:    string;
    cat_frontend:  string;
    cat_backend:   string;
    cat_database:  string;
    cat_cloud:     string;
    cat_tools:     string;
  };
  experience: {
    section_label:        string;
    title:                string;
    subtitle:             string;
    present:              string;
    internship:           string;
    fulltime:             string;
    contract:             string;
    total_tenure:         string;
    promotion_title:      string;
    promotion_desc:       string;
    career_trajectory:    string;
    joined_xorgeek_title: string;
    joined_xorgeek_desc:  string;
  };
  projects: {
    section_label:     string;
    title:             string;
    subtitle:          string;
    view_all:          string;
    tech_used:         string;
    role:              string;
    see_details:       string;
    badge_office:      string;
    badge_personal:    string;
    metric_domain:     string;
    metric_stack:      string;
    metric_status:     string;
    status_production: string;
    status_active:     string;
  };
  runmate: {
    section_label:   string;
    title:           string;
    tagline:         string;
    subtitle:        string;
    playstore_btn:   string;
    appstore_btn:    string;
    website_btn:     string;
    admin_btn:       string;
    tab_runners:     string;
    tab_races:       string;
    tab_organizers:  string;
    tab_tech:        string;
    slider_prev:     string;
    slider_next:     string;
    gallery_hint:    string;
    tech_title:      string;
  };
  publications: {
    section_label: string;
    title:         string;
    subtitle:      string;
    published_in:  string;
    year:          string;
    authors:       string;
  };
  education: {
    section_label: string;
    title:         string;
    subtitle:      string;
    gpa:           string;
    cgpa:          string;
    coursework:    string;
  };
  contact: {
    section_label:       string;
    title:               string;
    subtitle:            string;
    name_label:          string;
    name_placeholder:    string;
    email_label:         string;
    email_placeholder:   string;
    message_label:       string;
    message_placeholder: string;
    send_btn:            string;
    sending:             string;
    success_msg:         string;
    or_reach:            string;
    location:            string;
  };
  footer: {
    built_with:    string;
    rights:        string;
  };
  workstation: WorkstationI18n;
}

/**
 * English translation dictionary.
 */
export const EN: TranslationSchema = {
  nav: {
    home:         'Home',
    about:        'About',
    skills:       'Skills',
    experience:   'Experience',
    projects:     'Projects',
    runmate:      'RunMate',
    publications: 'Publications',
    education:    'Education',
    contact:      'Contact',
    resume:       'Resume'
  },
  hero: {
    greeting:      "Hi, I'm",
    name:          'Nafi Ahmed',
    role:          'Software Developer & Data Specialist',
    roles:         ['Software Developer', 'Data Specialist', 'Mobile Developer', 'Cloud Engineer'],
    tagline:       'Building scalable web, mobile & cloud-powered applications from Dhaka, Bangladesh.',
    tagline_prefix: 'Building scalable:',
    tagline_web:    'web',
    tagline_mobile: 'mobile',
    tagline_cloud:  'cloud-powered applications',
    location:       'Dhaka, Bangladesh',
    cta_projects:  'View Projects',
    cta_contact:   'Get In Touch',
    cta_resume:    'Download CV',
    scroll_hint:   'Scroll to explore'
  },
  about: {
    section_label:      'About Me',
    title:              'Full-Stack Engineer · Mobile · Cloud · AI-Assisted Development',
    bio_1:              'I build production-ready systems across the full stack — Angular web apps, Flutter mobile platforms, and AWS cloud backends. Starting my career as a Flutter and Laravel developer, I expanded into Angular and cloud engineering to deliver scalable end-to-end products.',
    bio_2:              'At XORGeek, I served as a core engineer behind 6+ live client products — including the Koyama Shokai hospital logistics SPA with 4-tier RBAC, RunMate Club featuring real-time GPS tracking and live leaderboards, and multiple AWS-backed web and mobile systems. I also engineered automated CI/CD pipelines using GitHub and AWS CodeBuild for frontend deployments, managed AWS backend infrastructure, and configured custom domains and servers for client environments.',
    bio_3:              'To ship with greater speed and precision, I actively integrate AI tools into my engineering workflow, while continuously expanding my expertise in Node.js backend architectures, payment gateway integrations, and PL/SQL database programming.',
    stat_exp:           'Years Experience',
    stat_projects:      'Projects Delivered',
    stat_databases:     'Published Papers',
    stat_devops:        'Cloud Services',
    stat_exp_sub:       'Production Delivery',
    stat_projects_sub:  'Web & Mobile Apps',
    stat_databases_sub: 'IEEE & Peer-Reviewed',
    stat_devops_sub:    'AWS & Serverless',
    quick_facts_title:  'Quick Overview',
    role_label:         'Current Role',
    role_val:           'Software Developer @ XORGeek',
    location_label:     'Location',
    location_val:       'Dhaka, Bangladesh',
    education_label:    'Education',
    education_val:      'B.Sc. in CSE • AUST',
    focus_label:        'Core Focus',
    focus_val:          'Full-Stack & Cloud Architecture',
    status_active:      'Available for Opportunities'
  },
  skills: {
    section_label: 'Skills',
    title:         'Technologies I Work With',
    subtitle:      'A production-grade full-stack toolkit — mobile, web, backend, databases, and cloud.',
    cat_mobile:    'Mobile Development',
    cat_frontend:  'Front-End',
    cat_backend:   'Back-End',
    cat_database:  'Databases',
    cat_cloud:     'Cloud & DevOps',
    cat_tools:     'Tools, AI & ML'
  },
  experience: {
    section_label:        'Experience',
    title:                'Professional Journey',
    subtitle:             'From independent project delivery to core enterprise engineering — a chronological timeline of growth.',
    present:              'Present',
    internship:           'Internship',
    fulltime:             'Full-time',
    contract:             'Contract / Projects',
    total_tenure:         'Total Engineering Experience',
    promotion_title:      'Promoted to Full-time Software Developer',
    promotion_desc:       'Transitioned from 2-month internship to core engineering role following high-impact delivery on mobile architecture and backend pipelines.',
    career_trajectory:    'Career Progression',
    joined_xorgeek_title: 'Transitioned to Enterprise Engineering at XORGeek',
    joined_xorgeek_desc:  'Brought hands-on project and mobile architecture experience to deliver production platforms at scale.'
  },
  projects: {
    section_label:     'Projects',
    title:             'Things I\'ve Built',
    subtitle:          'A selection of projects spanning web, mobile, and cloud platforms.',
    view_all:          'View All',
    tech_used:         'Technologies',
    role:              'Role & Highlights',
    see_details:       'See Details',
    badge_office:      'XORGeek',
    badge_personal:    'Personal',
    metric_domain:     'Domain',
    metric_stack:      'Core Stack',
    metric_status:     'Status',
    status_production: 'Production',
    status_active:     'Active'
  },
  runmate: {
    section_label:   'Featured Mobile Application',
    title:           'RunMate Club — Track. Compete. Connect.',
    tagline:         'Smart Marathon Tracking & Running Community Platform',
    subtitle:        'Live GPS tracking with road-snap accuracy, real-time leaderboards, and community running — engineered for individual training, official marathons, and virtual challenges.',
    playstore_btn:   'Google Play',
    appstore_btn:    'App Store',
    website_btn:     'Official Website',
    admin_btn:       'Organizer Admin Hub',
    tab_runners:     'For Runners',
    tab_races:       'Official Races & Events',
    tab_organizers:  'For Organizers & Admin',
    tab_tech:        'Architecture & Security',
    slider_prev:     'Previous slide',
    slider_next:     'Next slide',
    gallery_hint:    'Interactive Showcase • Auto-playing preview',
    tech_title:      'Core Technology Stack & Architecture'
  },
  publications: {
    section_label: 'Publications',
    title:         'Research & Publications',
    subtitle:      'Peer-reviewed research in Machine Learning and Deep Learning.',
    published_in:  'Published in',
    year:          'Year',
    authors:       'Authors'
  },
  education: {
    section_label: 'Education',
    title:         'Academic Background',
    subtitle:      'My formal education journey.',
    gpa:           'GPA',
    cgpa:          'CGPA',
    coursework:    'Key Coursework'
  },
  contact: {
    section_label:       'Contact',
    title:               'Let\'s Work Together',
    subtitle:            'I\'m currently open to new opportunities. Whether you have a project, a question, or just want to say hello — my inbox is always open.',
    name_label:          'Your Name',
    name_placeholder:    'Enter your name',
    email_label:         'Your Email',
    email_placeholder:   'Enter your email address',
    message_label:       'Message',
    message_placeholder: 'How can I help you? Write your message here...',
    send_btn:            'Send Message',
    sending:             'Sending...',
    success_msg:         'Message sent! I\'ll get back to you soon.',
    or_reach:            'Or reach me directly',
    location:            'Dhaka, Bangladesh'
  },
  footer: {
    built_with:  'Built by Nafi Ahmed',
    rights:      'All rights reserved.'
  },
  workstation: WORKSTATION_I18N
};

export { WorkstationI18n, WORKSTATION_I18N };
