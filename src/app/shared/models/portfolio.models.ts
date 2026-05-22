// ─── Shared Portfolio Domain Models ──────────────────────────────────────────

export interface SkillCategory {
  key:    string;     // i18n key for label, e.g. 'cat_languages'
  icon:   string;     // FontAwesome icon class
  skills: string[];
}

export interface Skill {
  name:  string;
  level: number;  // 0–100
}

export interface Experience {
  company:   string;
  location:  string;
  role:      string;
  type:      'fulltime' | 'internship' | 'contract';
  startDate: string;
  endDate:   string | null;  // null = Present
  icon:      string;
  bullets:   string[];
  tech:      string[];
}

export interface Project {
  name:            string;
  description:     string;
  longDescription?: string;   // Extended description shown only on the details page
  highlights:      string;
  tech:            string[];
  icon:            string;
  color:           string;
  category:        'office' | 'personal';
  type:            string;
  link?:           string;
  github?:         string;
  youtube?:        string;
  playstore?:      string;
  appstore?:       string;
  screenshots?:    string[];
}

export interface Publication {
  title:    string;
  venue:    string;
  year:     string;
  authors:  string;
  icon:     string;
  color:    string;
  abstract: string;
  doi?:     string;
  link?:    string;
}

export interface Education {
  institution: string;
  location:    string;
  degree:      string;
  period:      string;
  gpa:         string;
  icon:        string;
  coursework:  string[];
}

export interface Leadership {
  role:         string;
  organization: string;
  period:       string;
  description:  string;
}

export interface ContactForm {
  name:    string;
  email:   string;
  message: string;
}
