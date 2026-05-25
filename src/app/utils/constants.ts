/* eslint-disable no-restricted-syntax */

export interface IAppRoutes {
  HOME: string;
  HERO: string;
  ABOUT: string;
  SKILLS: string;
  EXPERIENCE: string;
  PROJECTS: string;
  PROJECT_DETAILS: string;
  PUBLICATIONS: string;
  PUBLICATION_DETAILS: string;
  EDUCATION: string;
  CONTACT: string;
}

/**
 * Route path definitions for the portfolio application.
 */
export const AppRoutes: IAppRoutes = {
  HOME: '',
  HERO: 'hero',
  ABOUT: 'about',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  PROJECTS: 'projects',
  PROJECT_DETAILS: 'project/:id',
  PUBLICATIONS: 'publications',
  PUBLICATION_DETAILS: 'publication/:id',
  EDUCATION: 'education',
  CONTACT: 'contact'
};
