export type ProjectLinkVariant = 'link' | 'text' | 'unavailable';
export type ProjectImageLayout = 'grid' | 'wide';

export interface Project {
  id: string;
  title: string;
  titleNote?: string;
  description: string;
  tags: string[];
  imageUrls: string[];
  imageLayout?: ProjectImageLayout;
  projectUrl?: string;
  projectLinkLabel?: string;
  projectLinkVariant?: ProjectLinkVariant;
  year: string;
}
