export type SellerType = 'Individual' | 'Verified Dealer' | 'Business Vendor';
export type ListingCategory = 'Vehicles' | 'Property' | 'Electronics' | 'Home & Furniture' | 'Jobs' | 'Services' | 'Fashion' | 'Agriculture' | 'Sports' | 'Other';
export type ListingStatus = 'Active' | 'Sold' | 'Under Review' | 'Draft' | 'Pending Approval' | 'Expired';
export type OrderStatus = 'Pending Payment' | 'Escrow Funded' | 'In Transit' | 'Inspection' | 'Completed' | 'Disputed' | 'Refunded';
export type DisputeStatus = 'Open' | 'Under Review' | 'Resolved' | 'Escalated';
export type NotificationType = 'order' | 'payment' | 'dispute' | 'system' | 'offer' | 'listing';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'HIGH_ADMIN' | 'VENDOR_ADMIN' | 'VENDOR_STAFF' | 'CUSTOMER';
  avatar?: string;
  fidelityScore: number;
  phone?: string;
  joinDate?: string;
  totalOrders?: number;
  totalSpent?: number;
  savedListings?: string[];
  isVerified?: boolean;
  responseRate?: number;
}

export interface SellerIdentity {
  id: string;
  name: string;
  type: SellerType;
  rating: number;
  isVerified: boolean;
  joinDate: string;
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  responseRate?: number;
  totalSales?: number;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  isNegotiable: boolean;
  category: ListingCategory;
  subcategory?: string;
  location: string;
  postedAt: string;
  postedTimestamp: number;
  expiresAt?: number;
  imageUrl: string;
  imageHint: string;
  images?: string[];
  seller: SellerIdentity;
  vendorId: string;
  description: string;
  status: ListingStatus;
  isEscrowProtected: boolean;
  isEasyDelivery?: boolean;
  isFreeShipping?: boolean;
  requiresMultisig?: boolean;
  isEmphasis?: boolean;
  isBoosted?: boolean;
  boostTier?: 'Standard' | 'Premium' | 'Elite';
  condition?: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair';
  specs?: string[];
  viewCount?: number;
  saveCount?: number;
  inquiryCount?: number;
  stock?: number;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  vendorId: string;
  amount: number;
  platformFee: number;
  netPayout: number;
  status: OrderStatus;
  escrowProgress: number;
  createdAt: string;
  updatedAt: string;
  deliveryDeadline: string;
  slaTimer: string;
  slaExpired?: boolean;
  trackingCode?: string;
  deliveryMethod?: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  disputeId?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  type: 'payment_in' | 'payout' | 'refund' | 'fee' | 'escrow_hold' | 'escrow_release';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: 'buyer' | 'seller';
  reason: string;
  description: string;
  status: DisputeStatus;
  createdAt: string;
  evidence?: string[];
  resolution?: string;
}

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  offerAmount: number;
  originalPrice: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  createdAt: string;
  expiresAt: string;
}

// ─── MOCK USERS ────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: 'u1', name: 'Admin', email: 'admin@vault.com', role: 'HIGH_ADMIN',
    fidelityScore: 100, phone: '0541988383', joinDate: '2023-01-01',
    totalOrders: 0, totalSpent: 0, isVerified: true, responseRate: 100,
  },
  {
    id: 'u2', name: 'Melcom Manager', email: 'vendor@melcom.com', role: 'VENDOR_ADMIN',
    fidelityScore: 98, phone: '0200123456', joinDate: '2023-03-15',
    totalOrders: 142, totalSpent: 4200000, isVerified: true, responseRate: 97,
  },
  {
    id: 'u3', name: 'Logistics Staff', email: 'staff@logistics.com', role: 'VENDOR_STAFF',
    fidelityScore: 100, phone: '0244987654', joinDate: '2023-06-01',
    totalOrders: 22, totalSpent: 0, isVerified: true, responseRate: 100,
  },
  {
    id: 'u4', name: 'Kofi Mensah', email: 'user@example.com', role: 'CUSTOMER',
    fidelityScore: 92, phone: '0554321098', joinDate: '2023-09-20',
    totalOrders: 8, totalSpent: 124500, isVerified: true, responseRate: 89,
    savedListings: ['lp1', 'ph2', 'v1'],
  }
];

const DEFAULT_SELLER: SellerIdentity = {
  id: 's1', name: 'Melcom Digital Hub', type: 'Business Vendor',
  rating: 4.9, isVerified: true, joinDate: '2018',
  phone: '0541988383', whatsapp: '233541988383',
  responseRate: 97, totalSales: 1240,
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8821', listingId: 'lp1', listingTitle: 'MacBook Pro M3 Max - Space Black Edition',
    listingImage: 'https://images.pexels.com/photos/3822336/pexels-photo-3822336.png?auto=compress&cs=tinysrgb&h=650&w=940',
    buyerId: 'u4', sellerId: 's1', sellerName: 'Melcom Digital Hub', vendorId: 'v1',
    amount: 45000, platformFee: 1125, netPayout: 43875,
    status: 'In Transit', escrowProgress: 65,
    createdAt: '2026-03-18T10:15:00Z', updatedAt: '2026-03-19T14:30:00Z',
    deliveryDeadline: '2026-03-22T10:15:00Z', slaTimer: '32:15:00',
    trackingCode: 'ACC-2026-88210', deliveryMethod: 'delivery',
    deliveryAddress: 'East Legon, Accra',
  },
  {
    id: 'ORD-8815', listingId: 'ph1', listingTitle: 'iPhone 15 Pro Max Titanium',
    listingImage: 'https://images.pexels.com/photos/4071887/pexels-photo-4071887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    buyerId: 'u4', sellerId: 's1', sellerName: 'Melcom Digital Hub', vendorId: 'v1',
    amount: 19500, platformFee: 487.5, netPayout: 19012.5,
    status: 'Inspection', escrowProgress: 90,
    createdAt: '2026-03-16T09:00:00Z', updatedAt: '2026-03-21T08:00:00Z',
    deliveryDeadline: '2026-03-21T09:00:00Z', slaTimer: 'Expired', slaExpired: true,
    trackingCode: 'ACC-2026-88150', deliveryMethod: 'pickup',
  },
  {
    id: 'ORD-8790', listingId: 'v1', listingTitle: 'Toyota Land Cruiser V8 2024',
    listingImage: 'https://images.pexels.com/photos/5852406/pexels-photo-5852406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    buyerId: 'u4', sellerId: 's3', sellerName: 'AutoTrust Motors', vendorId: 'v3',
    amount: 1850000, platformFee: 37000, netPayout: 1813000,
    status: 'Completed', escrowProgress: 100,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-02-18T15:00:00Z',
    deliveryDeadline: '2026-02-17T09:00:00Z', slaTimer: 'Completed',
    trackingCode: 'ACC-2026-87900', deliveryMethod: 'pickup',
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-001', orderId: 'ORD-8821', type: 'escrow_hold', amount: 45000, description: 'Escrow funded for MacBook Pro M3 Max', date: '2026-03-18', status: 'completed', reference: 'PSK-REF-0012A' },
  { id: 'TXN-002', orderId: 'ORD-8815', type: 'escrow_hold', amount: 19500, description: 'Escrow funded for iPhone 15 Pro Max', date: '2026-03-16', status: 'completed', reference: 'PSK-REF-0011B' },
  { id: 'TXN-003', orderId: 'ORD-8790', type: 'escrow_release', amount: 1813000, description: 'Payout released for Toyota Land Cruiser', date: '2026-02-18', status: 'completed', reference: 'PSK-REF-0009C' },
  { id: 'TXN-004', orderId: 'ORD-8790', type: 'fee', amount: 37000, description: 'Platform commission: Toyota Land Cruiser', date: '2026-02-18', status: 'completed', reference: 'PSK-REF-0009D' },
  { id: 'TXN-005', orderId: 'ORD-8821', type: 'payment_in', amount: 45000, description: 'Payment received: MacBook Pro M3 Max', date: '2026-03-18', status: 'pending', reference: 'PSK-REF-0012E' },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N1', type: 'order', title: 'Order In Transit', message: 'Your MacBook Pro M3 Max is on its way. Tracking: ACC-2026-88210', isRead: false, createdAt: '2026-03-19T14:30:00Z', actionUrl: '/orders/ORD-8821' },
  { id: 'N2', type: 'payment', title: 'Escrow Funded', message: 'GH₵19,500 has been locked in escrow for your iPhone 15 Pro Max order.', isRead: false, createdAt: '2026-03-16T09:05:00Z', actionUrl: '/orders/ORD-8815' },
  { id: 'N3', type: 'system', title: 'Delivery Window Expiring', message: 'Order ORD-8815 delivery window has expired. Please open a dispute if item not received.', isRead: false, createdAt: '2026-03-21T09:00:00Z', actionUrl: '/orders/ORD-8815' },
  { id: 'N4', type: 'offer', title: 'New Offer Received', message: 'Someone offered GH₵40,000 on your MacBook Pro listing.', isRead: true, createdAt: '2026-03-20T11:00:00Z', actionUrl: '/dashboard' },
  { id: 'N5', type: 'listing', title: 'Listing Approved', message: 'Your listing "Toyota Land Cruiser V8 2024" is now live on the marketplace.', isRead: true, createdAt: '2026-02-09T08:00:00Z' },
];

// ─── OFFERS ──────────────────────────────────────────────────────────────────
export const MOCK_OFFERS: Offer[] = [
  {
    id: 'OFR-001', listingId: 'lp1', listingTitle: 'MacBook Pro M3 Max - Space Black Edition',
    buyerName: 'Kwame Asante', offerAmount: 40000, originalPrice: 45000,
    message: 'Is this still available? Would you take GH₵40,000?',
    status: 'pending', createdAt: '2026-03-20T11:00:00Z', expiresAt: '2026-03-23T11:00:00Z',
  },
  {
    id: 'OFR-002', listingId: 'ph2', listingTitle: 'Samsung Galaxy S24 Ultra AI',
    buyerName: 'Abena Mensah', offerAmount: 15000, originalPrice: 17800,
    message: 'Can we do GH₵15,000? Cash ready today.',
    status: 'countered', counterAmount: 16500, createdAt: '2026-03-19T15:30:00Z', expiresAt: '2026-03-22T15:30:00Z',
  },
];

// ─── DISPUTES ─────────────────────────────────────────────────────────────────
export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'DSP-001', orderId: 'ORD-8815', raisedBy: 'buyer',
    reason: 'Item not as described', description: 'The iPhone 15 Pro Max received has a scratched screen. The listing stated "Brand New".',
    status: 'Under Review', createdAt: '2026-03-21T10:00:00Z',
  },
];

// ─── VENDOR ANALYTICS ──────────────────────────────────────────────────────────
export const VENDOR_MONTHLY_DATA = [
  { month: "Oct", revenue: 48000, orders: 12, disputes: 0 },
  { month: "Nov", revenue: 72000, orders: 18, disputes: 1 },
  { month: "Dec", revenue: 125000, orders: 31, disputes: 0 },
  { month: "Jan", revenue: 89000, orders: 22, disputes: 1 },
  { month: "Feb", revenue: 186750, orders: 41, disputes: 0 },
  { month: "Mar", revenue: 142000, orders: 34, disputes: 0 },
];

export const PLATFORM_MONTHLY_DATA = [
  { month: "Oct", gmv: 450000, commission: 11250, users: 85 },
  { month: "Nov", gmv: 620000, commission: 15500, users: 112 },
  { month: "Dec", gmv: 1200000, commission: 30000, users: 189 },
  { month: "Jan", gmv: 890000, commission: 22250, users: 156 },
  { month: "Feb", gmv: 1450000, commission: 36250, users: 210 },
  { month: "Mar", gmv: 1850000, commission: 46250, users: 248 },
];

// ─── LISTINGS ──────────────────────────────────────────────────────────────────
export const LISTINGS: Listing[] = [
  // LAPTOPS
  { id: 'lp1', title: 'MacBook Pro M3 Max - Space Black Edition', price: 45000, isNegotiable: true, category: 'Electronics', subcategory: 'Laptops', location: 'Airport Residential', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/3822336/pexels-photo-3822336.png?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'laptop', vendorId: 'v1', description: 'Factory sealed. 14-core CPU, 36GB unified memory. The fastest Mac ever made, available now in Accra.', status: 'Active', isEscrowProtected: true, specs: ['M3 Max', '36GB RAM', '1TB SSD'], seller: DEFAULT_SELLER, condition: 'New', viewCount: 847, saveCount: 23, inquiryCount: 12, stock: 3, isBoosted: true, boostTier: 'Elite' },
  { id: 'lp2', title: 'Dell XPS 15 InfinityEdge', price: 28500, oldPrice: 32000, isNegotiable: false, category: 'Electronics', subcategory: 'Laptops', location: 'Cantonments', postedAt: '2h ago', postedTimestamp: 1710972000000, imageUrl: 'https://images.pexels.com/photos/1466609/pexels-photo-1466609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'laptop', vendorId: 'v1', description: 'Stunning OLED 4K display, Core i9 processor. Ideal for professionals and creatives. Brand new, sealed box.', status: 'Active', isEscrowProtected: true, specs: ['Core i9', '16GB RAM', 'OLED 4K'], seller: DEFAULT_SELLER, condition: 'New', viewCount: 412, saveCount: 8, inquiryCount: 5 },
  { id: 'lp3', title: 'HP Spectre x360 Convertible', price: 18000, isNegotiable: true, category: 'Electronics', subcategory: 'Laptops', location: 'East Legon', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/36478646/pexels-photo-36478646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'laptop', vendorId: 'v1', description: '360-degree touchscreen convertible laptop. Perfect for presentations, drawing, and everyday use.', status: 'Active', isEscrowProtected: true, specs: ['Core i7', '16GB RAM', 'Touchscreen'], seller: DEFAULT_SELLER, condition: 'New', viewCount: 193, saveCount: 4, inquiryCount: 2 },
  { id: 'lp4', title: 'Lenovo ThinkPad X1 Carbon Gen 11', price: 22000, isNegotiable: false, category: 'Electronics', subcategory: 'Laptops', location: 'Ridge', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/3550482/pexels-photo-3550482.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'laptop', vendorId: 'v1', description: 'Ultra-light carbon fibre laptop with military-grade durability. Fingerprint reader and IR camera included.', status: 'Active', isEscrowProtected: true, specs: ['vPro i7', '32GB RAM', 'Carbon Fibre'], seller: DEFAULT_SELLER, condition: 'New', viewCount: 334, saveCount: 11, inquiryCount: 7 },
  { id: 'lp5', title: 'ASUS ROG Zephyrus G14 Gaming', price: 15500, isNegotiable: true, category: 'Electronics', subcategory: 'Laptops', location: 'Spintex', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/3951449/pexels-photo-3951449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'laptop', vendorId: 'v1', description: 'Compact 14-inch gaming powerhouse with RTX 4060 graphics. Runs AAA games and creative workloads with ease.', status: 'Active', isEscrowProtected: true, specs: ['Ryzen 9', 'RTX 4060', '120Hz'], seller: DEFAULT_SELLER, condition: 'New', viewCount: 621, saveCount: 19, inquiryCount: 9 },
  // MOBILES
  { id: 'ph1', title: 'iPhone 15 Pro Max Titanium', price: 19500, isNegotiable: false, category: 'Electronics', subcategory: 'Mobiles', location: 'Airport Residential', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/4071887/pexels-photo-4071887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'iphone', vendorId: 'v1', description: 'Brand new iPhone 15 Pro Max with official Ghanaian warranty. Titanium design, A17 Pro chip, 48MP camera system.', status: 'Active', isEscrowProtected: true, seller: DEFAULT_SELLER, condition: 'New', viewCount: 1203, saveCount: 47, inquiryCount: 31, stock: 5 },
  { id: 'ph2', title: 'Samsung Galaxy S24 Ultra', price: 17800, isNegotiable: true, category: 'Electronics', subcategory: 'Mobiles', location: 'Osu', postedAt: '1h ago', postedTimestamp: 1710975600000, imageUrl: 'https://images.pexels.com/photos/7742503/pexels-photo-7742503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'samsung', vendorId: 'v1', description: 'Galaxy AI-powered flagship with built-in S Pen. 200MP camera, 5000mAh battery. Direct from authorized dealer.', status: 'Active', isEscrowProtected: true, seller: DEFAULT_SELLER, condition: 'New', viewCount: 987, saveCount: 32, inquiryCount: 18 },
  { id: 'ph3', title: 'Google Pixel 8 Pro', price: 12500, isNegotiable: false, category: 'Electronics', subcategory: 'Mobiles', location: 'Kumasi', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/7026427/pexels-photo-7026427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'pixel', vendorId: 'v1', description: 'Pure Android experience with Google AI features. Best camera on any Android phone. 7 years of OS updates guaranteed.', status: 'Active', isEscrowProtected: true, seller: DEFAULT_SELLER, condition: 'New', viewCount: 445, saveCount: 9, inquiryCount: 6 },
  { id: 'ph4', title: 'OnePlus 12 Emerald Forest', price: 11000, isNegotiable: true, category: 'Electronics', subcategory: 'Mobiles', location: 'Tema', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/63690/pexels-photo-63690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'oneplus', vendorId: 'v1', description: '100W SuperVOOC fast charging — fully charged in 26 minutes. Snapdragon 8 Gen 3, 50MP Hasselblad camera.', status: 'Active', isEscrowProtected: true, seller: DEFAULT_SELLER, condition: 'New', viewCount: 312, saveCount: 7, inquiryCount: 3 },
  { id: 'ph5', title: 'Nothing Phone (2)', price: 8500, isNegotiable: false, category: 'Electronics', subcategory: 'Mobiles', location: 'East Legon', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/36307740/pexels-photo-36307740.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'nothing', vendorId: 'v1', description: 'Unique transparent design with Glyph Interface LED system. Clean Android experience. Sealed, brand new.', status: 'Active', isEscrowProtected: true, seller: DEFAULT_SELLER, condition: 'New', viewCount: 178, saveCount: 5, inquiryCount: 2 },
  // VEHICLES
  { id: 'v1', title: 'Toyota Land Cruiser V8 2024', price: 1850000, isNegotiable: true, category: 'Vehicles', location: 'Airport Residential', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/5852406/pexels-photo-5852406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'suv', vendorId: 'v3', description: 'Full luxury trim, V8 engine, leather seats, panoramic sunroof. Accra serviced with complete service history.', status: 'Active', isEscrowProtected: true, isEmphasis: true, seller: { id: 's3', name: 'AutoTrust', type: 'Verified Dealer', rating: 4.9, isVerified: true, joinDate: '2021', responseRate: 95, totalSales: 45 }, condition: 'New', viewCount: 2341, saveCount: 89, inquiryCount: 44 },
  { id: 'v2', title: 'Mercedes-Benz G63 AMG', price: 2450000, isNegotiable: false, category: 'Vehicles', location: 'Cantonments', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/3473486/pexels-photo-3473486.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'gwagon', vendorId: 'v3', description: 'Iconic G-Wagon in matte black. AMG performance package, 577hp V8 biturbo. One of only 3 in Ghana.', status: 'Active', isEscrowProtected: true, isEmphasis: true, seller: { id: 's3', name: 'AutoTrust', type: 'Verified Dealer', rating: 4.9, isVerified: true, joinDate: '2021', responseRate: 95, totalSales: 45 }, condition: 'New', viewCount: 3102, saveCount: 124, inquiryCount: 67 },
  { id: 'v3', title: 'Range Rover Sport 2023', price: 1650000, isNegotiable: true, category: 'Vehicles', location: 'East Legon', postedAt: '2h ago', postedTimestamp: 1710972000000, imageUrl: 'https://images.pexels.com/photos/36624758/pexels-photo-36624758.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'rover', vendorId: 'v3', description: 'P400 petrol engine, panoramic glass roof, air suspension. Barely used, under 5,000 km.', status: 'Active', isEscrowProtected: true, seller: { id: 's3', name: 'AutoTrust', type: 'Verified Dealer', rating: 4.9, isVerified: true, joinDate: '2021' }, condition: 'New', viewCount: 1876, saveCount: 55, inquiryCount: 28 },
  { id: 'v4', title: 'Hyundai Tucson 2024 Luxury', price: 450000, isNegotiable: false, category: 'Vehicles', location: 'Spintex', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/4077265/pexels-photo-4077265.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'tucson', vendorId: 'v3', description: 'Fuel-efficient SUV with blind-spot monitoring, heated seats, and smart cruise control. Automatic transmission.', status: 'Active', isEscrowProtected: true, seller: { id: 's3', name: 'AutoTrust', type: 'Verified Dealer', rating: 4.9, isVerified: true, joinDate: '2021' }, condition: 'New', viewCount: 892, saveCount: 21, inquiryCount: 11 },
  { id: 'v5', title: 'Kantanka Amoanim', price: 185000, isNegotiable: true, category: 'Vehicles', location: 'Kumasi', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'kantanka', vendorId: 'v3', description: 'Proudly made in Ghana. Reliable family saloon, petrol engine, affordable parts and servicing nationwide.', status: 'Active', isEscrowProtected: true, seller: { id: 's3', name: 'AutoTrust', type: 'Verified Dealer', rating: 4.9, isVerified: true, joinDate: '2021' }, condition: 'Good', viewCount: 567, saveCount: 14, inquiryCount: 8 },
  // AGRICULTURE
  { id: 'ag1', title: 'John Deere 5075E Tractor', price: 125000, isNegotiable: true, category: 'Agriculture', location: 'Kumasi', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/5014249/pexels-photo-5014249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'tractor', vendorId: 'v4', description: '75HP utility tractor suitable for medium-scale farms. Includes front loader attachment. Low hours, well maintained.', status: 'Active', isEscrowProtected: true, seller: { id: 's4', name: 'AgroPrime', type: 'Verified Dealer', rating: 4.8, isVerified: true, joinDate: '2019' }, condition: 'New', viewCount: 234, saveCount: 6, inquiryCount: 4 },
  { id: 'ag2', title: 'Hydroponic Greenhouse Kit', price: 15000, isNegotiable: false, category: 'Agriculture', location: 'Tema', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/6495907/pexels-photo-6495907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'hydro', vendorId: 'v4', description: 'Complete indoor farming system. Grow vegetables year-round without soil. Ideal for urban farmers and restaurants.', status: 'Active', isEscrowProtected: true, seller: { id: 's4', name: 'AgroPrime', type: 'Verified Dealer', rating: 4.8, isVerified: true, joinDate: '2019' }, condition: 'New', viewCount: 145, saveCount: 3, inquiryCount: 2 },
  { id: 'ag3', title: 'Solar Cocoa Dryer', price: 8500, isNegotiable: true, category: 'Agriculture', location: 'Koforidua', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/5208265/pexels-photo-5208265.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'drier', vendorId: 'v4', description: 'Solar-powered drying system for cocoa and other crops. Reduces post-harvest losses by up to 80%.', status: 'Active', isEscrowProtected: true, seller: { id: 's4', name: 'AgroPrime', type: 'Verified Dealer', rating: 4.8, isVerified: true, joinDate: '2019' }, condition: 'New', viewCount: 89, saveCount: 2, inquiryCount: 1 },
  { id: 'ag4', title: 'Hybrid Maize Seeds — 50kg Bulk', price: 2500, isNegotiable: false, category: 'Agriculture', location: 'Tamale', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/60507/maize-corn-indian-corn-vegetables-60507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'seeds', vendorId: 'v4', description: 'Certified high-yield hybrid maize seeds. Drought-tolerant variety tested for Northern Ghana conditions.', status: 'Active', isEscrowProtected: true, seller: { id: 's4', name: 'AgroPrime', type: 'Verified Dealer', rating: 4.8, isVerified: true, joinDate: '2019' }, condition: 'New', viewCount: 78, saveCount: 1, inquiryCount: 1 },
  { id: 'ag5', title: 'Automated Poultry Feeder', price: 12000, isNegotiable: true, category: 'Agriculture', location: 'Osu', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/35877058/pexels-photo-35877058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'poultry', vendorId: 'v4', description: 'Sensor-controlled feeder for poultry farms. Reduces feed waste by 30%, supports up to 2,000 birds.', status: 'Active', isEscrowProtected: true, seller: { id: 's4', name: 'AgroPrime', type: 'Verified Dealer', rating: 4.8, isVerified: true, joinDate: '2019' }, condition: 'New', viewCount: 112, saveCount: 3, inquiryCount: 2 },
  // FASHION
  { id: 'fa1', title: 'Hand-Woven Royal Kente', price: 4500, isNegotiable: true, category: 'Fashion', location: 'Kumasi', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/35933377/pexels-photo-35933377.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'kente', vendorId: 'v5', description: 'Authentic hand-woven Kente from Bonwire, Ashanti Region. Royal pattern, vibrant colours, 6-yard piece.', status: 'Active', isEscrowProtected: true, seller: { id: 's5', name: 'Heritage', type: 'Business Vendor', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 456, saveCount: 18, inquiryCount: 9 },
  { id: 'fa2', title: 'Custom Northern Smock', price: 1200, isNegotiable: false, category: 'Fashion', location: 'Tamale', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/7774245/pexels-photo-7774245.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'smock', vendorId: 'v5', description: 'Handcrafted in Tamale by master weavers. Traditional fugu smock with embroidery. Custom sizing available.', status: 'Active', isEscrowProtected: true, seller: { id: 's5', name: 'Heritage', type: 'Business Vendor', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 234, saveCount: 7, inquiryCount: 4 },
  { id: 'fa3', title: 'African Suit — Accra Style', price: 2800, isNegotiable: true, category: 'Fashion', location: 'Airport', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/3613388/pexels-photo-3613388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'suit', vendorId: 'v5', description: 'Modern African suit combining Kente fabric with a contemporary tailored silhouette. Ready to wear.', status: 'Active', isEscrowProtected: true, seller: { id: 's5', name: 'Heritage', type: 'Business Vendor', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 312, saveCount: 11, inquiryCount: 6 },
  { id: 'fa4', title: 'Leather Sandals — Kumasi Made', price: 850, isNegotiable: false, category: 'Fashion', location: 'Kumasi', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/4637874/pexels-photo-4637874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'sandals', vendorId: 'v5', description: 'Full grain leather sandals handcrafted in Kumasi. Durable, comfortable, and great for both casual and formal wear.', status: 'Active', isEscrowProtected: true, seller: { id: 's5', name: 'Heritage', type: 'Business Vendor', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 167, saveCount: 4, inquiryCount: 2 },
  { id: 'fa5', title: 'Gold Adinkra Cufflinks', price: 1500, isNegotiable: true, category: 'Fashion', location: 'Osu', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/3859935/pexels-photo-3859935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'cufflinks', vendorId: 'v5', description: '24k gold-plated cufflinks featuring Adinkra symbols. Gye Nyame and Sankofa designs available. Gift-boxed.', status: 'Active', isEscrowProtected: true, seller: { id: 's5', name: 'Heritage', type: 'Business Vendor', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 223, saveCount: 8, inquiryCount: 5 },
  // SERVICES
  { id: 'se1', title: 'Corporate Legal Audit', price: 15000, isNegotiable: false, category: 'Services', location: 'Ridge', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/6077797/pexels-photo-6077797.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'legal', vendorId: 'v6', description: 'Full legal compliance audit for businesses operating in Ghana. Covers contracts, tax obligations, and corporate governance.', status: 'Active', isEscrowProtected: true, seller: { id: 's6', name: 'LegalNode', type: 'Business Vendor', rating: 4.9, isVerified: true, joinDate: '2021' }, condition: 'Not Applicable' as any, viewCount: 189, saveCount: 5, inquiryCount: 4 },
  { id: 'se2', title: 'Solar Panel Installation', price: 45000, isNegotiable: true, category: 'Services', location: 'East Legon', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/356049/pexels-photo-356049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'solar', vendorId: 'v6', description: 'Complete rooftop solar installation for homes and offices. 5kW system, 10-year warranty, ECG net metering setup included.', status: 'Active', isEscrowProtected: true, seller: { id: 's6', name: 'LegalNode', type: 'Business Vendor', rating: 4.9, isVerified: true, joinDate: '2021' }, viewCount: 312, saveCount: 9, inquiryCount: 7 },
  { id: 'se3', title: 'Cyber Security Penetration Test', price: 8500, isNegotiable: false, category: 'Services', location: 'Accra', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/5474025/pexels-photo-5474025.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'cyber', vendorId: 'v6', description: 'Professional vulnerability assessment and penetration testing for websites, apps, and networks. Report delivered within 72 hours.', status: 'Active', isEscrowProtected: true, seller: { id: 's6', name: 'LegalNode', type: 'Business Vendor', rating: 4.9, isVerified: true, joinDate: '2021' }, viewCount: 445, saveCount: 12, inquiryCount: 8 },
  { id: 'se4', title: 'Real Estate Valuation', price: 3500, isNegotiable: true, category: 'Services', location: 'Airport', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'valuation', vendorId: 'v6', description: 'RICS-standard property valuation by certified surveyors. Accepted by all Ghanaian banks for mortgage applications.', status: 'Active', isEscrowProtected: true, seller: { id: 's6', name: 'LegalNode', type: 'Business Vendor', rating: 4.9, isVerified: true, joinDate: '2021' }, viewCount: 234, saveCount: 6, inquiryCount: 3 },
  { id: 'se5', title: 'Event Planning & Management', price: 12000, isNegotiable: false, category: 'Services', location: 'Cantonments', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/36028895/pexels-photo-36028895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'event', vendorId: 'v6', description: 'Full event planning for weddings, corporate events, and private parties. Includes décor, catering coordination, and logistics.', status: 'Active', isEscrowProtected: true, seller: { id: 's6', name: 'LegalNode', type: 'Business Vendor', rating: 4.9, isVerified: true, joinDate: '2021' }, viewCount: 167, saveCount: 4, inquiryCount: 2 },
  // SPORTS
  { id: 'sp1', title: 'TechnoGym Commercial Treadmill', price: 12500, isNegotiable: true, category: 'Sports', location: 'East Legon', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/4944435/pexels-photo-4944435.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'treadmill', vendorId: 'v7', description: 'Professional-grade treadmill suitable for home gym or commercial use. Max speed 22km/h, incline up to 15%. Barely used.', status: 'Active', isEscrowProtected: true, seller: { id: 's7', name: 'SportHub', type: 'Verified Dealer', rating: 4.7, isVerified: true, joinDate: '2022' }, condition: 'New', viewCount: 289, saveCount: 7, inquiryCount: 4 },
  { id: 'sp2', title: 'Olympic Dumbbell Set — 50kg', price: 3500, isNegotiable: false, category: 'Sports', location: 'Osu', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/6550843/pexels-photo-6550843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'weights', vendorId: 'v7', description: 'Cast iron Olympic dumbbells, calibrated and knurled. Set includes 2kg–25kg pairs. Ideal for home gym setup.', status: 'Active', isEscrowProtected: true, seller: { id: 's7', name: 'SportHub', type: 'Verified Dealer', rating: 4.7, isVerified: true, joinDate: '2022' }, condition: 'New', viewCount: 178, saveCount: 4, inquiryCount: 2 },
  { id: 'sp3', title: 'Carbon Road Bike — Elite Series', price: 8200, isNegotiable: true, category: 'Sports', location: 'Aburi', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/5807740/pexels-photo-5807740.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'bike', vendorId: 'v7', description: 'Lightweight carbon frame road bike. Shimano 105 groupset, hydraulic disc brakes. Great for Accra–Aburi hill rides.', status: 'Active', isEscrowProtected: true, seller: { id: 's7', name: 'SportHub', type: 'Verified Dealer', rating: 4.7, isVerified: true, joinDate: '2022' }, condition: 'New', viewCount: 223, saveCount: 6, inquiryCount: 3 },
  { id: 'sp4', title: 'Outdoor Basketball Court Setup', price: 25000, isNegotiable: false, category: 'Sports', location: 'Tema', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/5586440/pexels-photo-5586440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'hoop', vendorId: 'v7', description: 'Full half-court installation including rubber flooring, two hoops, and court markings. Suitable for schools and compounds.', status: 'Active', isEscrowProtected: true, seller: { id: 's7', name: 'SportHub', type: 'Verified Dealer', rating: 4.7, isVerified: true, joinDate: '2022' }, condition: 'New', viewCount: 145, saveCount: 3, inquiryCount: 2 },
  { id: 'sp5', title: 'Professional Boxing Ring', price: 18000, isNegotiable: true, category: 'Sports', location: 'Bukom', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/4754000/pexels-photo-4754000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'ring', vendorId: 'v7', description: 'WBC-specification 16ft boxing ring. Includes corner posts, ropes, canvas, and padding. Assembly included in Accra.', status: 'Active', isEscrowProtected: true, seller: { id: 's7', name: 'SportHub', type: 'Verified Dealer', rating: 4.7, isVerified: true, joinDate: '2022' }, condition: 'New', viewCount: 189, saveCount: 5, inquiryCount: 3 },
  // PROPERTY
  { id: 'pr1', title: 'Luxury 5-Bedroom Villa', price: 8500000, isNegotiable: true, category: 'Property', location: 'Airport Residential', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/36353275/pexels-photo-36353275.png?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'villa', vendorId: 'v2', description: 'Fully detached 5-bed, 5-bath villa in Airport Residential. Swimming pool, staff quarters, generator, and borehole.', status: 'Active', isEscrowProtected: true, isEmphasis: true, seller: { id: 's2', name: 'PrimeEstate', type: 'Verified Dealer', rating: 5.0, isVerified: true, joinDate: '2020', responseRate: 100, totalSales: 85 }, condition: 'New', viewCount: 4521, saveCount: 189, inquiryCount: 78 },
  { id: 'pr2', title: 'Commercial Office Complex — Ridge', price: 12000000, isNegotiable: false, category: 'Property', location: 'Ridge', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/36288084/pexels-photo-36288084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'office', vendorId: 'v2', description: '6-storey commercial building in Ridge. Currently 90% occupied with long-term tenants. Excellent rental yield.', status: 'Active', isEscrowProtected: true, seller: { id: 's2', name: 'PrimeEstate', type: 'Verified Dealer', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 2341, saveCount: 89, inquiryCount: 34 },
  { id: 'pr3', title: 'Serviced Penthouse — Cantonments', price: 4500000, isNegotiable: true, category: 'Property', location: 'Cantonments', postedAt: 'Today', postedTimestamp: 1710979200000, imageUrl: 'https://images.pexels.com/photos/4979494/pexels-photo-4979494.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'penthouse', vendorId: 'v2', description: 'Top-floor penthouse with panoramic Accra views. 3 bedrooms, 3 bathrooms, open-plan kitchen, private terrace.', status: 'Active', isEscrowProtected: true, seller: { id: 's2', name: 'PrimeEstate', type: 'Verified Dealer', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 1876, saveCount: 67, inquiryCount: 29 },
  { id: 'pr4', title: 'Industrial Warehouse — Tema Free Zone', price: 6500000, isNegotiable: true, category: 'Property', location: 'Tema', postedAt: 'Yesterday', postedTimestamp: 1710892800000, imageUrl: 'https://images.pexels.com/photos/27111449/pexels-photo-27111449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'warehouse', vendorId: 'v2', description: '5,000 sqm warehouse in Tema Free Zone. 3-phase power, loading bays, 24/7 security. Port access within 10 minutes.', status: 'Active', isEscrowProtected: true, seller: { id: 's2', name: 'PrimeEstate', type: 'Verified Dealer', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 1234, saveCount: 45, inquiryCount: 18 },
  { id: 'pr5', title: 'Prime Residential Plot — East Legon', price: 1200000, isNegotiable: false, category: 'Property', location: 'East Legon', postedAt: 'Just Now', postedTimestamp: 1710986400000, imageUrl: 'https://images.pexels.com/photos/3030307/pexels-photo-3030307.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageHint: 'plot', vendorId: 'v2', description: 'Registered 0.5-acre plot with site plan and indenture ready. Located behind East Legon Hills. Ready to build.', status: 'Active', isEscrowProtected: true, seller: { id: 's2', name: 'PrimeEstate', type: 'Verified Dealer', rating: 5.0, isVerified: true, joinDate: '2020' }, condition: 'New', viewCount: 987, saveCount: 34, inquiryCount: 14 },
];

export const VENDORS = [
  { id: 'v1', name: 'Melcom Digital Hub', category: 'Electronics', description: "Ghana's premier electronics retailer. Authorized Apple, Samsung, and Dell dealer.", logoUrl: 'https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', bgUrl: 'https://images.pexels.com/photos/9083011/pexels-photo-9083011.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.9, itemsCount: 1240, fidelityScore: 98, joinedYear: '2018', commissionRate: 2.5, monthlyRevenue: 186750, totalOrders: 142, disputeRate: 0.7 },
  { id: 'v2', name: 'PrimeEstate GH', category: 'Property', description: 'Luxury real estate across Greater Accra. Over 85 properties sold.', logoUrl: 'https://images.pexels.com/photos/5186884/pexels-photo-5186884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', bgUrl: 'https://images.pexels.com/photos/7078502/pexels-photo-7078502.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 5.0, itemsCount: 85, fidelityScore: 100, joinedYear: '2020', commissionRate: 2.0, monthlyRevenue: 450000, totalOrders: 34, disputeRate: 0.0 },
  { id: 'v3', name: 'AutoTrust Motors', category: 'Vehicles', description: 'Accra\'s most trusted vehicle dealership. New and pre-owned cars with full history.', logoUrl: 'https://images.pexels.com/photos/36550302/pexels-photo-36550302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', bgUrl: 'https://images.pexels.com/photos/28965346/pexels-photo-28965346.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.9, itemsCount: 45, fidelityScore: 99, joinedYear: '2021', commissionRate: 1.5, monthlyRevenue: 890000, totalOrders: 28, disputeRate: 1.2 },
  { id: 'v4', name: 'AgroPrime Ghana', category: 'Agriculture', description: 'Farming equipment, seeds, and technology for Ghanaian farmers.', logoUrl: 'https://images.pexels.com/photos/36404084/pexels-photo-36404084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', bgUrl: 'https://images.pexels.com/photos/36584953/pexels-photo-36584953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.8, itemsCount: 312, fidelityScore: 100, joinedYear: '2019', commissionRate: 3.0, monthlyRevenue: 67000, totalOrders: 89, disputeRate: 0.5 },
  { id: 'v5', name: 'Heritage Fashion', category: 'Fashion', description: 'Authentic Ghanaian fashion: Kente, Smock, Adinkra, and contemporary African designs.', logoUrl: 'https://images.pexels.com/photos/4430943/pexels-photo-4430943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', bgUrl: 'https://images.pexels.com/photos/36315462/pexels-photo-36315462.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 5.0, itemsCount: 890, fidelityScore: 100, joinedYear: '2020', commissionRate: 3.0, monthlyRevenue: 42000, totalOrders: 234, disputeRate: 0.0 },
];

// ─── BUSINESS LOGIC HELPERS ───────────────────────────────────────────────────

/**
 * Compute dynamic fidelity score from user profile.
 * Accepts null/undefined — returns base score of 70 when no user is logged in.
 */
export function computeFidelityScore(user: User | null | undefined): number {
  if (!user) return 70;
  let score = 70;
  if (user.isVerified) score += 10;
  if ((user.totalOrders || 0) >= 5) score += 5;
  if ((user.totalOrders || 0) >= 20) score += 5;
  if ((user.responseRate || 0) >= 90) score += 5;
  if ((user.savedListings?.length || 0) > 0) score += 2;
  return Math.min(score, 100);
}

/** Calculate platform commission for a given amount and vendor tier */
export function calcCommission(amount: number, vendorId: string): { fee: number; net: number; rate: number } {
  const vendor = VENDORS.find(v => v.id === vendorId);
  const rate = vendor?.commissionRate ?? 2.5;
  const fee = amount * (rate / 100);
  return { fee, net: amount - fee, rate };
}

/** Check if a listing price qualifies for multisig approval */
export function requiresAdminApproval(price: number): boolean {
  return price >= 50000;
}

/** Get fidelity tier label */
export function getFidelityTier(score: number): { label: string; color: string } {
  if (score >= 98) return { label: 'Platinum', color: 'text-cyan-500' };
  if (score >= 90) return { label: 'Gold', color: 'text-yellow-500' };
  if (score >= 80) return { label: 'Silver', color: 'text-slate-400' };
  return { label: 'Standard', color: 'text-muted-foreground' };
}

/** Format GHS price with proper Cedi formatting */
export function formatGHS(amount: number): string {
  return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
