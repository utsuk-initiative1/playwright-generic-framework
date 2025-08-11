export type CourseData = {
  [key: string]: {
    id: string;
    title: string;
    instructor: string;
    rating: string;
    price: string;
    category: string;
    description: string;
  };
};

export type ProductData = {
  [key: string]: {
    id: string;
    title: string;
    creator: string;
    price: string;
    currency: string;
    category: string;
    description: string;
  };
};

export type UserData = {
  [key: string]: {
    email: string;
    password: string;
    name: string;
    type: 'regular' | 'pro';
  };
};

export const TestCourses: CourseData = {
  'figma-ui-design': {
    id: 'figma-ui-design',
    title: 'Learn UI Design with Figma from Scratch',
    instructor: 'Daniele Buffa',
    rating: '4.9/5',
    price: '99',
    category: 'UI/UX Design',
    description: 'Complete UI design course using Figma'
  },
  'nordic-branding': {
    id: 'nordic-branding',
    title: 'Nordic Design Intensive Course: Complete Branding',
    instructor: 'Hmmm Creative Studio',
    rating: '5/5',
    price: '149',
    category: 'Branding',
    description: 'Comprehensive branding course with Nordic design principles'
  },
  'figma-web-design': {
    id: 'figma-web-design',
    title: 'Innovative Web Design in Figma: A Step-by-Step Process',
    instructor: 'Louis Paquet',
    rating: '5/5',
    price: '79',
    category: 'Web Design',
    description: 'Step-by-step web design process using Figma'
  },
  'figma-complete': {
    id: 'figma-complete',
    title: 'Learn Figma from 0 to 100 (10 Courses)',
    instructor: 'Mirko Santangelo',
    rating: '5/5',
    price: '199',
    category: 'Figma',
    description: 'Complete Figma mastery course bundle'
  }
};

export const TestProducts: ProductData = {
  'framer-template-bundle': {
    id: 'framer-template-bundle',
    title: 'Unlimited Access · Framer Template Bundle',
    creator: 'Bryn Taylor',
    price: '249',
    currency: 'USD',
    category: 'Digital Product',
    description: 'Comprehensive Framer template collection'
  },
  'stickify-framer': {
    id: 'stickify-framer',
    title: 'Stickify - Framer Template',
    creator: 'Dmytri Ivanov',
    price: '69',
    currency: 'USD',
    category: 'Templates',
    description: 'Modern Framer template for sticky navigation'
  },
  'nordstudio-portfolio': {
    id: 'nordstudio-portfolio',
    title: 'Nordstudio — Framer Portfolio Template',
    creator: 'Jilles @BoldCreatives',
    price: '99',
    currency: 'EUR',
    category: 'Templates',
    description: 'Professional portfolio template for designers'
  },
  'ambiente-webflow': {
    id: 'ambiente-webflow',
    title: 'Ambiente - Design Webflow Template (FREE FIGMA)',
    creator: 'temlis',
    price: '129',
    currency: 'USD',
    category: 'Templates',
    description: 'Webflow template with included Figma files'
  }
};

export const TestUsers: UserData = {
  'regular-user': {
    email: 'madhukarbanoth14',
    password: 'Madhu@456',
    name: 'Madhukar Banoth',
    type: 'regular'
  },
  'pro-user': {
    email: 'prouser@example.com',
    password: 'ProPassword123!',
    name: 'Pro User',
    type: 'pro'
  },
  'invalid-user': {
    email: 'invalid@email.com',
    password: 'wrongpassword',
    name: 'Invalid User',
    type: 'regular'
  }
};

export const AwardCategories = [
  'E-commerce',
  'Architecture',
  'Restaurant & Hotel',
  'Design Agencies',
  'Business & Corporate',
  'Fashion',
  'Mobile & Apps',
  'Interaction Design',
  'Illustration',
  'Header Design'
];

export const TechnologyFilters = [
  'CSS animations',
  'Wordpress',
  'Shopify',
  'WebGL sites',
  'React Websites',
  '3D websites',
  'Figma',
  'Gsap',
  'Framer',
  'Webflow'
];

export const FeaturedSites = [
  'Joy From Africa',
  'LEOLEO',
  '35mm',
  'Caffè Design',
  'OPTIKKA',
  'Beings'
];

export const NomineeSites = [
  'Daydream Player',
  'Michael Brown',
  'The hands that sew Balenciaga'
];

export const FeaturedCreators = [
  'jordan-taylor-1',
  'Airnauts',
  'Clay',
  'Baunfire',
  'Felipe Medeiros',
  'Neither/Nor',
  'awejones'
]; 