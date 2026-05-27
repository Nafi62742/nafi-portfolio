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
    section_label:  string;
    title:          string;
    bio_1:          string;
    bio_2:          string;
    bio_3:          string;
    stat_exp:       string;
    stat_projects:  string;
    stat_databases: string;
    stat_devops:    string;
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
    section_label: string;
    title:         string;
    subtitle:      string;
    present:       string;
    internship:    string;
    fulltime:      string;
  };
  projects: {
    section_label: string;
    title:         string;
    subtitle:      string;
    view_all:      string;
    tech_used:     string;
    role:          string;
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
    section_label: string;
    title:         string;
    subtitle:      string;
    name_label:    string;
    email_label:   string;
    message_label: string;
    send_btn:      string;
    sending:       string;
    success_msg:   string;
    or_reach:      string;
    location:      string;
  };
  footer: {
    built_with:    string;
    rights:        string;
  };
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
    section_label: 'About Me',
    title:         'Full-Stack Developer & Cloud Practitioner',
    bio_1:         'I\'m a versatile Software Developer and Data Specialist with 2+ years of professional experience building scalable applications and data-driven systems.',
    bio_2:         'At XORGeek, I engineer high-performance Angular web apps, cross-platform Flutter mobile applications, and robust Node.js/Laravel backend services.',
    bio_3:         'I manage and maintain production databases (both SQL and NoSQL) and design efficient AWS cloud DevOps pipelines to streamline deployments and ensure high availability.',
    stat_exp:      'Years Experience',
    stat_projects: 'Projects Completed',
    stat_databases: 'Databases Management',
    stat_devops:   'Cloud Services'
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
    cat_tools:     'Tools & Analytics'
  },
  experience: {
    section_label: 'Experience',
    title:         'Professional Journey',
    subtitle:      'Where I\'ve worked and what I\'ve built.',
    present:       'Present',
    internship:    'Internship',
    fulltime:      'Full-time'
  },
  projects: {
    section_label:   'Projects',
    title:           'Things I\'ve Built',
    subtitle:        'A selection of projects spanning web, mobile, and cloud platforms.',
    view_all:        'View All',
    tech_used:       'Technologies',
    role:            'Role & Highlights'
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
    section_label:   'Contact',
    title:           'Let\'s Work Together',
    subtitle:        'I\'m currently open to new opportunities. Whether you have a project, a question, or just want to say hello — my inbox is always open.',
    name_label:      'Your Name',
    email_label:     'Your Email',
    message_label:   'Message',
    send_btn:        'Send Message',
    sending:         'Sending...',
    success_msg:     'Message sent! I\'ll get back to you soon.',
    or_reach:        'Or reach me directly',
    location:        'Dhaka, Bangladesh'
  },
  footer: {
    built_with:  'Built by Nafi Ahmed',
    rights:      'All rights reserved.'
  }
};
