// Workshop Data for Basho Experiences
import { Workshop } from '@/types/workshop';

export const workshops: Workshop[] = [
  {
    id: 'wheel-throwing-basics-001',
    name: 'Wheel Throwing Basics',
    type: 'group',
    level: 'beginner',
    description: 'Learn the fundamentals of pottery wheel throwing in this hands-on workshop.',
    longDescription: `Discover the meditative art of pottery wheel throwing in our beginner-friendly workshop. Under expert guidance, you'll learn centering techniques, basic shaping, and the fundamentals of working with clay.`,
    images: ['/Images/workshop-pieces/1.png'],
    duration: '3 hours',
    participants: { min: 6, max: 8 },
    price: 2500,
    pricePerPerson: true,
    includes: [
      'All materials',
      'Apron provided',
      'Lunch included',
      'Take home pieces you made',
      'Certificate',
    ],
    requirements: ['No prior experience needed', 'Wear comfortable clothes'],
    schedule: [
      {
        id: 'wtb-2026-01-12-10',
        date: '2026-01-12',
        startTime: '10:00 AM',
        endTime: '1:00 PM',
        availableSpots: 8,
        isAvailable: true,
      },
      {
        id: 'wtb-2026-01-12-14',
        date: '2026-01-12',
        startTime: '2:00 PM',
        endTime: '5:00 PM',
        availableSpots: 8,
        isAvailable: true,
      },
      {
        id: 'wtb-2026-01-19-10',
        date: '2026-01-19',
        startTime: '10:00 AM',
        endTime: '1:00 PM',
        availableSpots: 8,
        isAvailable: true,
      },
    ],
    location: 'Basho Studio, City Light Road, Surat',
    instructor: 'Shivangi',
    takeHome: '2 finished pottery pieces',
    providedMaterials: ['Clay', 'Tools', 'Apron'],
    certificate: true,
    lunchIncluded: true,
    featured: true,
  },

  {
    id: 'hand-building-sculpting-002',
    name: 'Hand Building & Sculpting',
    type: 'group',
    level: 'beginner',
    description: 'Create pottery using traditional hand-building techniques.',
    longDescription: `Learn pinching, coiling, and slab-building techniques to create beautiful hand-built pottery.`,
    images: ['/Images/workshop-pieces/2.png'],
    duration: '4 hours',
    participants: { min: 6, max: 10 },
    price: 3000,
    pricePerPerson: true,
    includes: ['All materials', 'Lunch included', 'Certificate'],
    requirements: ['No prior experience needed'],
    schedule: [
      {
        id: 'hbs-2026-01-15-10',
        date: '2026-01-15',
        startTime: '10:00 AM',
        endTime: '2:00 PM',
        availableSpots: 10,
        isAvailable: true,
      },
      {
        id: 'hbs-2026-01-22-10',
        date: '2026-01-22',
        startTime: '10:00 AM',
        endTime: '2:00 PM',
        availableSpots: 10,
        isAvailable: true,
      },
    ],
    location: 'Basho Studio, City Light Road, Surat',
    instructor: 'Shivangi',
    takeHome: '2 hand-built pieces',
    providedMaterials: ['Clay', 'Hand tools'],
    certificate: true,
    lunchIncluded: true,
    featured: true,
  },

  {
    id: 'one-on-one-masterclass-003',
    name: 'One-on-One Masterclass',
    type: 'private',
    level: 'intermediate',
    description: 'Personalized pottery session tailored to your skill level.',
    longDescription: `A private pottery masterclass designed for focused learning and creative freedom.`,
    images: ['/Images/workshop-pieces/3.png'],
    duration: '2–3 hours',
    participants: { min: 1, max: 1 },
    price: 5000,
    pricePerPerson: false,
    includes: ['Personalized instruction', 'All materials'],
    requirements: ['Advance booking required'],
    schedule: [
      {
        id: 'oom-2026-01-12-10',
        date: '2026-01-12',
        startTime: '10:00 AM',
        endTime: '1:00 PM',
        availableSpots: 1,
        isAvailable: true,
      },
    ],
    location: 'Basho Studio, City Light Road, Surat',
    instructor: 'Shivangi',
    takeHome: 'Depends on project',
    providedMaterials: ['All materials'],
    certificate: false,
    lunchIncluded: false,
    featured: true,
  },

  {
    id: 'couples-pottery-date-004',
    name: 'Couples Pottery Date',
    type: 'experience',
    level: 'beginner',
    experienceType: 'couples_date',
    description: 'A romantic pottery experience for two.',
    longDescription: `Create pottery together in a cozy, romantic studio setting.`,
    images: ['/Images/workshop-pieces/5.png'],
    duration: '2.5 hours',
    participants: { min: 2, max: 2 },
    price: 4500,
    pricePerPerson: false,
    includes: ['Private session', 'Refreshments'],
    requirements: ['Advance booking required'],
    schedule: [
      {
        id: 'cpd-2026-01-14-17',
        date: '2026-01-14',
        startTime: '5:00 PM',
        endTime: '7:30 PM',
        availableSpots: 1,
        isAvailable: true,
      },
    ],
    location: 'Basho Studio, City Light Road, Surat',
    instructor: 'Shivangi',
    takeHome: 'Pottery pieces created together',
    providedMaterials: ['Clay', 'Tools'],
    certificate: false,
    lunchIncluded: false,
    featured: false,
  },
];

// Helpers
export const getWorkshopById = (id: string): Workshop | undefined =>
  workshops.find(w => w.id === id);

export const getFeaturedWorkshops = (): Workshop[] =>
  workshops.filter(w => w.featured);

export const getWorkshopsByType = (type: string): Workshop[] =>
  workshops.filter(w => w.type === type);

export const getWorkshopsByLevel = (level: string): Workshop[] =>
  workshops.filter(w => w.level === level);
