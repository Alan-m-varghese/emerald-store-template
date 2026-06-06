"use client";

// Check if window is defined (for Next.js SSR)
const isBrowser = typeof window !== "undefined";

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  compareAtPrice: number;
  category: string; // category slug (e.g. apparel, home-living)
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  size?: string;
  color?: string;
  isActive: boolean;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  count: string;
  image: string;
}

export interface MockOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface MockOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  items: MockOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  couponCode?: string;
  trackingNumber?: string;
  courier?: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface MockCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
}

export interface MockSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  taxRate: number;
  maintenanceMode: boolean;
}

export interface MockUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "CUSTOMER" | "ADMIN";
}

// Default Data
const DEFAULT_USERS: MockUser[] = [
  {
    name: "System Admin",
    email: "admin@emeraldstore.in",
    passwordHash: "adminPassword123",
    role: "ADMIN",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@gmail.com",
    passwordHash: "customerPassword123",
    role: "CUSTOMER",
  },
];
const DEFAULT_PRODUCTS: MockProduct[] = [
  {
    id: "p1",
    name: "Classic Silk Emerald Saree",
    description: "Indulge in the luxury of pure Mulberry Silk. Handwoven by master craftsmen, this emerald green saree features intricate gold zari borders, making it an elegant masterpiece for weddings and festive occasions.",
    slug: "classic-silk-emerald-saree",
    price: 3499,
    compareAtPrice: 4999,
    category: "apparel",
    stock: 15,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    size: "Free Size",
    color: "Emerald Green",
    isActive: true,
  },
  {
    id: "p2",
    name: "Minimalist Brass Table Lamp",
    description: "Bring warm ambience to your workspace or bedside table. Featuring a solid brass base and clean minimalist lines, this table lamp is both a functional light source and a modern art statement piece.",
    slug: "minimalist-brass-table-lamp",
    price: 1899,
    compareAtPrice: 2499,
    category: "home-living",
    stock: 8,
    rating: 4.6,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
    size: "Standard",
    color: "Brass/Gold",
    isActive: true,
  },
  {
    id: "p3",
    name: "Premium Cotton Linen Kurta",
    description: "Stay cool and comfortable in our premium cotton-linen blend. Tailored for a modern fit, it features a band collar, wooden buttons, and a clean silhouette suitable for semi-formal or everyday wear.",
    slug: "premium-cotton-linen-kurta",
    price: 1299,
    compareAtPrice: 1999,
    category: "apparel",
    stock: 20,
    rating: 4.5,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    size: "L",
    color: "Off-White",
    isActive: true,
  },
  {
    id: "p4",
    name: "Handwoven Jute Floor Rug",
    description: "An eco-friendly, organic jute rug hand-braided by local artisans. Adds texture, warmth, and a cozy rustic feel to living rooms, bedrooms, or entryways.",
    slug: "handwoven-jute-floor-rug",
    price: 2199,
    compareAtPrice: 2999,
    category: "home-living",
    stock: 5,
    rating: 4.9,
    reviewsCount: 204,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600",
    size: "4x6 ft",
    color: "Natural Jute",
    isActive: true,
  },
  {
    id: "p5",
    name: "Organic Bamboo Coffee Mug",
    description: "Make your mornings sustainable. Crafted from premium organic bamboo fibre with a food-grade silicone sleeve and leak-proof lid. Reusable, durable, and dishwasher safe.",
    slug: "organic-bamboo-coffee-mug",
    price: 599,
    compareAtPrice: 799,
    category: "home-living",
    stock: 32,
    rating: 4.4,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    size: "350ml",
    color: "Sage Green",
    isActive: true,
  },
  {
    id: "p6",
    name: "Pure Mulberry Silk Eye Mask",
    description: "Experience deep, uninterrupted sleep. Made with double-sided 19 momme mulberry silk and a soft elastic band. Gently protects skin and eyes from irritation and wrinkles.",
    slug: "pure-mulberry-silk-eye-mask",
    price: 799,
    compareAtPrice: 999,
    category: "apparel",
    stock: 18,
    rating: 4.7,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=600",
    size: "One Size",
    color: "Charcoal Black",
    isActive: true,
  }
];

const DEFAULT_CATEGORIES: MockCategory[] = [
  { id: "c1", name: "Apparel & Fashion", slug: "apparel", count: "120+ Items", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" },
  { id: "c2", name: "Home & Decor", slug: "home-living", count: "80+ Items", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400" },
  { id: "c3", name: "Eco-Friendly Tech", slug: "electronics", count: "45+ Items", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
];

const DEFAULT_COUPONS: MockCoupon[] = [
  { id: "cp1", code: "EMERALD10", discountType: "PERCENTAGE", discountValue: 10, minOrderValue: 0, isActive: true },
  { id: "cp2", code: "WELCOME15", discountType: "PERCENTAGE", discountValue: 15, minOrderValue: 999, isActive: true },
  { id: "cp3", code: "FLAT300", discountType: "FIXED", discountValue: 300, minOrderValue: 2499, isActive: true },
];

const DEFAULT_ORDERS: MockOrder[] = [
  {
    id: "ORD-9284",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh@gmail.com",
    date: "Jun 5, 2026",
    total: 3499,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    items: [
      { id: "p1", name: "Classic Silk Emerald Saree", price: 3499, quantity: 1, size: "Free Size", color: "Emerald Green", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600" }
    ],
    shippingAddress: { street: "Flat 405, Block C, Maple Heights", city: "Mumbai", state: "Maharashtra", postalCode: "400001", phone: "9876543210" }
  },
  {
    id: "ORD-9283",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@yahoo.com",
    date: "Jun 5, 2026",
    total: 1299,
    status: "PENDING",
    paymentStatus: "UNPAID",
    items: [
      { id: "p3", name: "Premium Cotton Linen Kurta", price: 1299, quantity: 1, size: "L", color: "Off-White", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600" }
    ],
    shippingAddress: { street: "12, Shanti Kunj, Near Lake", city: "Udaipur", state: "Rajasthan", postalCode: "313001", phone: "9812345678" }
  },
  {
    id: "ORD-9282",
    customerName: "Amit Patel",
    customerEmail: "amit.patel@outlook.com",
    date: "Jun 4, 2026",
    total: 2199,
    status: "DELIVERED",
    paymentStatus: "PAID",
    items: [
      { id: "p4", name: "Handwoven Jute Floor Rug", price: 2199, quantity: 1, size: "4x6 ft", color: "Natural Jute", image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600" }
    ],
    shippingAddress: { street: "Plot 42, Sector 15", city: "Noida", state: "Uttar Pradesh", postalCode: "201301", phone: "9988776655" }
  }
];

const DEFAULT_CUSTOMERS: MockCustomer[] = [
  { id: "cust1", name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "9876543210", ordersCount: 1, totalSpent: 3499, status: "ACTIVE" },
  { id: "cust2", name: "Priya Sharma", email: "priya.sharma@yahoo.com", phone: "9812345678", ordersCount: 1, totalSpent: 1299, status: "ACTIVE" },
  { id: "cust3", name: "Amit Patel", email: "amit.patel@outlook.com", phone: "9988776655", ordersCount: 1, totalSpent: 2199, status: "ACTIVE" },
];

const DEFAULT_SETTINGS: MockSettings = {
  storeName: "Emerald Store",
  storeEmail: "support@emeraldstore.in",
  storePhone: "+91 99999 88888",
  currency: "INR",
  shippingCharge: 99,
  freeShippingThreshold: 1499,
  taxRate: 18,
  maintenanceMode: false
};

// Storage Helpers
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage:`, error);
  }
}

// Public API exports
export const dbMock = {
  // PRODUCTS
  getProducts: (): MockProduct[] => getStorageItem("emerald_db_products", DEFAULT_PRODUCTS),
  getProductById: (id: string): MockProduct | undefined => {
    return dbMock.getProducts().find((p) => p.id === id);
  },
  saveProducts: (products: MockProduct[]) => setStorageItem("emerald_db_products", products),
  addProduct: (product: Omit<MockProduct, "id" | "rating" | "reviewsCount" | "isActive">) => {
    const products = dbMock.getProducts();
    const newProduct: MockProduct = {
      ...product,
      id: "p_" + Date.now(),
      rating: 5.0,
      reviewsCount: 0,
      isActive: true
    };
    products.unshift(newProduct);
    dbMock.saveProducts(products);
    return newProduct;
  },
  updateProduct: (updatedProduct: MockProduct) => {
    const products = dbMock.getProducts();
    const index = products.findIndex((p) => p.id === updatedProduct.id);
    if (index > -1) {
      products[index] = updatedProduct;
      dbMock.saveProducts(products);
    }
  },
  deleteProduct: (id: string) => {
    const products = dbMock.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    dbMock.saveProducts(filtered);
  },

  // CATEGORIES
  getCategories: (): MockCategory[] => getStorageItem("emerald_db_categories", DEFAULT_CATEGORIES),
  saveCategories: (categories: MockCategory[]) => setStorageItem("emerald_db_categories", categories),

  // COUPONS
  getCoupons: (): MockCoupon[] => getStorageItem("emerald_db_coupons", DEFAULT_COUPONS),
  saveCoupons: (coupons: MockCoupon[]) => setStorageItem("emerald_db_coupons", coupons),
  addCoupon: (coupon: Omit<MockCoupon, "id" | "isActive">) => {
    const coupons = dbMock.getCoupons();
    const newCoupon: MockCoupon = {
      ...coupon,
      id: "cp_" + Date.now(),
      isActive: true
    };
    coupons.unshift(newCoupon);
    dbMock.saveCoupons(coupons);
    return newCoupon;
  },
  updateCoupon: (updatedCoupon: MockCoupon) => {
    const coupons = dbMock.getCoupons();
    const index = coupons.findIndex((c) => c.id === updatedCoupon.id);
    if (index > -1) {
      coupons[index] = updatedCoupon;
      dbMock.saveCoupons(coupons);
    }
  },

  // ORDERS
  getOrders: (): MockOrder[] => getStorageItem("emerald_db_orders", DEFAULT_ORDERS),
  saveOrders: (orders: MockOrder[]) => setStorageItem("emerald_db_orders", orders),
  addOrder: (order: Omit<MockOrder, "id" | "date" | "status" | "paymentStatus">) => {
    const orders = dbMock.getOrders();
    const newOrder: MockOrder = {
      ...order,
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "PENDING",
      paymentStatus: "PAID" // Default paid for simulated credit card/UPI transactions
    };
    orders.unshift(newOrder);
    dbMock.saveOrders(orders);

    // Update or create customer profile
    dbMock.trackCustomerPurchase(newOrder.customerName, newOrder.customerEmail, newOrder.shippingAddress.phone, newOrder.total);

    return newOrder;
  },
  updateOrder: (updatedOrder: MockOrder) => {
    const orders = dbMock.getOrders();
    const index = orders.findIndex((o) => o.id === updatedOrder.id);
    if (index > -1) {
      orders[index] = updatedOrder;
      dbMock.saveOrders(orders);
    }
  },

  // CUSTOMERS
  getCustomers: (): MockCustomer[] => getStorageItem("emerald_db_customers", DEFAULT_CUSTOMERS),
  saveCustomers: (customers: MockCustomer[]) => setStorageItem("emerald_db_customers", customers),
  trackCustomerPurchase: (name: string, email: string, phone: string, amount: number) => {
    const customers = dbMock.getCustomers();
    const existingIndex = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());

    if (existingIndex > -1) {
      customers[existingIndex].ordersCount += 1;
      customers[existingIndex].totalSpent += amount;
      customers[existingIndex].phone = phone; // update phone if changed
    } else {
      customers.push({
        id: "cust_" + Date.now(),
        name,
        email,
        phone,
        ordersCount: 1,
        totalSpent: amount,
        status: "ACTIVE"
      });
    }
    dbMock.saveCustomers(customers);
  },

  // SETTINGS
  getSettings: (): MockSettings => getStorageItem("emerald_db_settings", DEFAULT_SETTINGS),
  saveSettings: (settings: MockSettings) => setStorageItem("emerald_db_settings", settings),

  // USERS
  getUsers: (): MockUser[] => getStorageItem("emerald_db_users", DEFAULT_USERS),
  saveUsers: (users: MockUser[]) => setStorageItem("emerald_db_users", users),
  findUserByEmail: (email: string): MockUser | undefined => {
    return dbMock.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  },
  addUser: (name: string, email: string, passwordHash: string, role: "CUSTOMER" | "ADMIN" = "CUSTOMER"): MockUser => {
    const users = dbMock.getUsers();
    const newUser: MockUser = {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role
    };
    users.push(newUser);
    dbMock.saveUsers(users);
    return newUser;
  }
};
