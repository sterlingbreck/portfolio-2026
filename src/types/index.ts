export type ProjectLinkVariant = 'link' | 'text' | 'unavailable';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrls: string[];
  projectUrl?: string;
  projectLinkLabel?: string;
  projectLinkVariant?: ProjectLinkVariant;
  year: string;
}
