import 'next-auth';

type Project = {
    project_name: string,
    project_description: string,
    files: {
      html: string,
      css: string,
      javascript: string
    }
  }

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      projects: Project[]; 
    }
  }
}