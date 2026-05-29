export type QuantityType = "unit" | "weight" | "volume";
export type ListStatus = "open" | "completed";

export interface PurchaseItem {
  id: string;
  name: string;
  highlightColor: string; // hex
  icon: string; // nome do Material Icon
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ShoppingListItem {
  id: string;
  purchaseItemId: string;
  quantity: number; // > 0
  quantityType: QuantityType;
  inCart: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  description: string;
  status: ListStatus;
  totalValue: number | null;
  completedAt: string | null;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishItem {
  id: string;
  name: string;
  description: string;
  priceBRL: number;
  icon: string;
  purchaseLink: string; // pode ser ''
  photoUri: string | null;
  backgroundColor: string; // hex
  acquired: boolean;
  acquiredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeName =
  | "white"
  | "black"
  | "green"
  | "red"
  | "pink"
  | "yellow"
  | "purple"
  | "blue";

export type FontName = "Inter" | "Roboto" | "Poppins" | "Nunito" | "Lato";

export interface AppSettings {
  theme: ThemeName;
  fontFamily: FontName;
}
