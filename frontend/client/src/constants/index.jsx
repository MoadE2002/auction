import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../../public/assets/pfd/pfd1.webp";
import user2 from "../../public/assets/pfd/pfd2.webp";
import user3 from "../../public/assets/pfd/pfd3.webp";
import user4 from "../../public/assets/pfd/pfd4.webp";
import user5 from "../../public/assets/pfd/pfd5.webp";
import user6 from "../../public/assets/pfd/pfd6.webp";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
  {
    user: "John Matthews",
    company: "Auction Participant",
    image: user1,
    text: "The bidding experience was flawless! The platform is intuitive, and I was able to place bids easily. The real-time notifications kept me updated on auction progress, ensuring I never missed an opportunity.",
  },
  {
    user: "Sarah Davis",
    company: "Auctioneer",
    image: user2,
    text: "This auction platform has been a game-changer for my business. The integration with secure payment systems gives both me and my clients peace of mind, while the bidding process is smooth and efficient. Highly recommend!",
  },
  {
    user: "Michael Carter",
    company: "Auction Participant",
    image: user3,
    text: "I love the ability to track ongoing bids and receive real-time updates. The AI assistant also helped me navigate through various auctions and stay ahead of the competition. Definitely an enjoyable auction experience.",
  },
  {
    user: "Anna Thompson",
    company: "Auctioneer",
    image: user4,
    text: "As an auctioneer, this platform makes it easy for me to manage multiple auctions simultaneously. The secure payment system gives me confidence, and the notifications keep both my team and clients well-informed.",
  },
  {
    user: "Robert Blackwell",
    company: "Auction Participant",
    image: user5,
    text: "I was able to bid on items I really wanted and pay securely without any hassle. The entire auction process was straightforward and user-friendly. I look forward to participating in more auctions!",
  },
  {
    user: "Claire Hughes",
    company: "Auctioneer",
    image: user6,
    text: "Running auctions online has never been easier. The platform’s seamless functionality, secure payment systems, and instant notifications ensure that every auction runs smoothly from start to finish. I'm impressed!",
  },
];




export const features = [
  {
    icon: <BotMessageSquare />,
    text: "AI-Powered Auction Assistant",
    description:
      "Our AI assistant helps you discover the best auctions, track bids in real-time, and provides personalized recommendations to enhance your bidding experience.",
  },
  {
    icon: <Fingerprint />,
    text: "Secure Authentication & Payments",
    description:
      "Your security is our top priority. We ensure safe login with advanced authentication methods and secure payment gateways for a seamless and protected experience.",
  },
  {
    icon: <ShieldHalf />,
    text: "Privacy Protection",
    description:
      "We safeguard your personal and financial data with industry-leading encryption and strict privacy standards to ensure your information remains confidential.",
  },
  {
    icon: <BatteryCharging />,
    text: "Real-Time Notifications",
    description:
      "Stay updated with instant notifications about bid status, auction outcomes, and upcoming events. Never miss an opportunity to win your desired item.",
  },
  {
    icon: <PlugZap />,
    text: "Seamless Bidding Experience",
    description:
      "Enjoy a hassle-free bidding process with real-time updates, user-friendly navigation, and easy payment methods, making your auction experience smooth and efficient.",
  },
  {
    icon: <GlobeLock />,
    text: "Comprehensive Auction Analytics",
    description:
      "Gain valuable insights into your bidding history, track auction trends, and make informed decisions with detailed analytics tailored to enhance your auction performance.",
  },
];




export const checklistItems = [
  {
    title: "AI-Powered Auction Assistant",
    description:
      "Get real-time assistance from our AI bot to help you discover ongoing auctions, track bids, and manage your auction activity efficiently.",
  },
  {
    title: "Secure Payment System",
    description:
      "Bid and pay confidently with our secure payment system that ensures all transactions are safe and protected.",
  },
  {
    title: "Real-Time Auction Notifications",
    description:
      "Receive instant alerts for bid updates, auction outcomes, and important platform notifications, ensuring you stay ahead in the auction game.",
  },
  {
    title: "User Authentication & Account Security",
    description:
      "We prioritize your security by providing a robust user authentication system to protect your account and personal information.",
  },
];



export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];


export const categoryBrands = {
  Electronics: [
    'Apple',
    'Samsung',
    'Sony',
    'LG',
    'Dell',
    'HP',
    'Microsoft',
    'Bose',
    'Huawei',
    'Acer',
    'Asus',
    'Lenovo',
    'Canon',
    'Nikon',
    'GoPro',
    'Fitbit',
    'Xiaomi',
    'Panasonic',
  ],
  Fashion: [
    'Nike',
    'Adidas',
    'Zara',
    'H&M',
    'Gucci',
    'Chanel',
    'Louis Vuitton',
    'Prada',
    'Burberry',
    'Levi\'s',
    'Ray-Ban',
    'Tommy Hilfiger',
    'Calvin Klein',
    'The North Face',
    'Puma',
    'Under Armour',
  ],
  'Home & Kitchen': [
    'KitchenAid',
    'Breville',
    'Cuisinart',
    'Ninja',
    'Dyson',
    'Shark',
    'iRobot',
    'Instant Pot',
    'Lodge',
    'Bissell',
    'Hamilton Beach',
    'De\'Longhi',
    'Le Creuset',
    'Tefal',
    'Oster',
    'Smeg',
  ],
  Automotive: [
    'Ford',
    'Chevrolet',
    'Toyota',
    'Honda',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Tesla',
    'Nissan',
    'Hyundai',
    'Volkswagen',
    'Jeep',
    'Kia',
    'Subaru',
    'Mazda',
    'Chrysler',
  ],
  Books: [
    'Penguin Random House',
    'HarperCollins',
    'Hachette',
    'Simon & Schuster',
    'Macmillan',
    'Oxford University Press',
    'Wiley',
    'Cambridge University Press',
    'Prentice Hall',
    'Bloomsbury',
    'Routledge',
    'Pearson',
    'Scholastic',
    'DK',
  ],
  'Toys & Games': [
    'LEGO',
    'Mattel',
    'Hasbro',
    'Nerf',
    'Hot Wheels',
    'Fisher-Price',
    'Barbie',
    'Play-Doh',
    'Mega Bloks',
    'NERF',
    'Hot Wheels',
    'Playmobil',
    'Beyblade',
    'Schleich',
  ],
  'Health & Beauty': [
    'L\'Oréal',
    'Estée Lauder',
    'Clinique',
    'Neutrogena',
    'Olay',
    'Dove',
    'Maybelline',
    'Revlon',
    'MAC Cosmetics',
    'Urban Decay',
    'Nivea',
    'Lancôme',
    'Shiseido',
    'Kiehl\'s',
  ],
  Sports: [
    'Nike',
    'Adidas',
    'Under Armour',
    'Puma',
    'Reebok',
    'New Balance',
    'Columbia',
    'The North Face',
    'Patagonia',
    'Mammut',
    'Salomon',
    'Arc\'teryx',
    'Timberland',
    'Oakley',
  ],
  Others: [
    'N/A', 
  ],
};

