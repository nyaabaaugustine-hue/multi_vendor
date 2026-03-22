import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Listing, SellerIdentity, SellerType } from "./mock-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeListing(listing: any): Listing {
  const seller: SellerIdentity = listing.seller || {
    id: listing.sellerId || 'unknown',
    name: listing.sellerName || 'Private Seller',
    isVerified: listing.sellerIsVerified || false,
    type: (listing.sellerType as SellerType) || 'Individual',
    rating: listing.sellerRating ? parseFloat(listing.sellerRating.toString()) : 4.8,
    joinDate: listing.postedAt || 'Just Now',
    phone: listing.sellerPhone,
    whatsapp: listing.sellerWhatsapp,
    avatar: listing.sellerAvatar,
  };

  return {
    ...listing,
    price: typeof listing.price === 'string' ? parseFloat(listing.price) : (listing.price || 0),
    oldPrice: listing.oldPrice ? (typeof listing.oldPrice === 'string' ? parseFloat(listing.oldPrice) : listing.oldPrice) : undefined,
    seller,
  };
}
