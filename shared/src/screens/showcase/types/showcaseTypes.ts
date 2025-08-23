export type ShowcaseSection = 
  | 'overview'
  | 'ui' 
  | 'modals'
  | 'search' 
  | 'calendar' 
  | 'performance' 
  | 'scheduling'
  | 'student'
  | 'academy'
  | 'advanced'
  | 'hooks';

export interface ShowcaseSectionProps {
  theme: any;
  styles: any;
  screenDimensions: any;
}