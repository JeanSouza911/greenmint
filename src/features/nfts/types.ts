export interface NFT {
  id: string;
  name: string;
  creator: string;
  category: string;
  imageUrl: string;
  priceEth: string;
  available: boolean;
  createdAt: string;
  popularityScore: number;
  images: string[];
}

export interface NFTEdition {
  id: string;
  name: string;
  stock: number;
}

export interface NFT {
  id: string;
  name: string;
  creator: string;
  category: string;
  imageUrl: string;
  priceEth: string;
  available: boolean;
  createdAt: string;
  popularityScore: number;
  editions: NFTEdition[];
}
