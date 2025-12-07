"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit2,
  IndianRupee,
  LayoutDashboard,
  Layers,
  Loader2,
  LogOut,
  Menu,
  Package,
  Plus,
  RefreshCcw,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  ImageIcon,
  Eye,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

const statusOptions = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = (typeof statusOptions)[number];


type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specification?: string | null;
  supplier_info?: string | null;
  ring_sizes?: string[] | null;
  bracelet_sizes?: string[] | null;
  payal_sizes?: string[] | null;
  price: string | number;
  discount_price: string | number | null;
  images: string[];
  category_id?: string | null;
  stock: number | null;
  is_featured: boolean | null;
  created_at?: string;
};

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  created_at?: string;
};

type OrderRecord = {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: string | number;
  items?: Array<{
    productId?: string;
    name?: string;
    quantity: number;
    price: number;
  }> | null;
  created_at?: string;
};

type CouponRecord = {
  id: string;
  code: string;
  discount_type: "flat" | "percentage";
  discount_value: string | number;
  min_purchase?: string | number | null;
  expires_at?: string | null;
};

type ProfileRecord = {
  id: string;
  full_name?: string | null;
  name?: string | null;
  role?: "admin" | "customer" | null;
  created_at?: string;
};

type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  specification: string;
  supplierInfo: string;
  ringSizes: string;
  braceletSizes: string;
  payalSizes: string;
  price: string;
  discountPrice: string;
  imageUrls: string[];
  stock: string;
  isFeatured: boolean;
  categoryId: string;
};

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

type CouponFormState = {
  id?: string;
  code: string;
  discountType: "flat" | "percentage";
  discountValue: string;
  minPurchase: string;
  expiresAt: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   DEFAULTS & HELPERS
───────────────────────────────────────────────────────────────────────────── */

const defaultProductForm: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  specification: "",
  supplierInfo: "",
  ringSizes: "",
  braceletSizes: "",
  payalSizes: "",
  price: "",
  discountPrice: "",
  imageUrls: [],
  stock: "10",
  isFeatured: false,
  categoryId: "",
};

const defaultCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const defaultCouponForm: CouponFormState = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  expiresAt: "",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIRMATION MODAL
───────────────────────────────────────────────────────────────────────────── */

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "danger" | "warning";
}

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  loading,
  variant = "danger",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
              variant === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5 sm:mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 ${
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE UPLOADER COMPONENT
───────────────────────────────────────────────────────────────────────────── */

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

function ImageUploader({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();
        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-colors ${
          dragOver ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop images or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-600 font-semibold hover:text-amber-700"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-400">Max {maxImages} images, 5MB each</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN ADMIN PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const toast = useToast();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const [activeView, setActiveView] = useState<
    "dashboard" | "products" | "categories" | "orders" | "coupons" | "users"
  >("dashboard");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // Data states
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [users, setUsers] = useState<ProfileRecord[]>([]);

  // Loading states
  const [initializing, setInitializing] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});

  // Form states
  const [productForm, setProductForm] = useState<ProductFormState>(defaultProductForm);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(defaultCategoryForm);
  const [couponForm, setCouponForm] = useState<CouponFormState>(defaultCouponForm);
  const [productSearch, setProductSearch] = useState("");

  // Operation states
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [orderUpdatingId, setOrderUpdatingId] = useState<string | null>(null);
  const [userUpdatingId, setUserUpdatingId] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    loading: boolean;
    variant: "danger" | "warning";
  }>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    onConfirm: () => {},
    loading: false,
    variant: "danger",
  });

  // Prevent duplicate error toasts
  const errorShownRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     COMPUTED VALUES
  ───────────────────────────────────────────────────────────────────────── */

  const categoryLookup = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.slug].filter(Boolean).some((value) => value!.toLowerCase().includes(query))
    );
  }, [productSearch, products]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status === "cancelled") return sum;
      return sum + Number(order.total_amount || 0);
    }, 0);
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const lowStockItems = products.filter((product) => (product.stock ?? 0) < 5).length;
    return {
      totalRevenue,
      pendingOrders,
      productCount: products.length,
      customerCount: users.length,
      lowStockItems,
    };
  }, [orders, products, users.length]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const lowStockProducts = useMemo(
    () => products.filter((product) => (product.stock ?? 0) < 5).slice(0, 5),
    [products]
  );

  /* ─────────────────────────────────────────────────────────────────────────
     DATA FETCHING (via API routes)
  ───────────────────────────────────────────────────────────────────────── */

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (mountedRef.current) {
        setProducts(data.products ?? []);
        setDataErrors((prev) => ({ ...prev, products: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      if (mountedRef.current) {
        setDataErrors((prev) => ({ ...prev, products: "Unable to load products" }));
        if (!errorShownRef.current.has("products")) {
          errorShownRef.current.add("products");
          toast.error("Unable to load products");
        }
      }
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (mountedRef.current) {
        setCategories(data.categories ?? []);
        setDataErrors((prev) => ({ ...prev, categories: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      if (mountedRef.current) {
        setDataErrors((prev) => ({ ...prev, categories: "Unable to load categories" }));
        if (!errorShownRef.current.has("categories")) {
          errorShownRef.current.add("categories");
          toast.error("Unable to load categories");
        }
      }
    }
  }, [toast]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (mountedRef.current) {
        setOrders(data.orders ?? []);
        setDataErrors((prev) => ({ ...prev, orders: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      if (mountedRef.current) {
        setDataErrors((prev) => ({ ...prev, orders: "Unable to load orders" }));
        if (!errorShownRef.current.has("orders")) {
          errorShownRef.current.add("orders");
          toast.error("Unable to load orders");
        }
      }
    }
  }, [toast]);

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/coupons");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (mountedRef.current) {
        setCoupons(data.coupons ?? []);
        setDataErrors((prev) => ({ ...prev, coupons: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      if (mountedRef.current) {
        setDataErrors((prev) => ({ ...prev, coupons: "Unable to load coupons" }));
        if (!errorShownRef.current.has("coupons")) {
          errorShownRef.current.add("coupons");
          toast.error("Unable to load coupons");
        }
      }
    }
  }, [toast]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      if (mountedRef.current) {
        setUsers(data.users ?? []);
        setDataErrors((prev) => ({ ...prev, users: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      if (mountedRef.current) {
        setDataErrors((prev) => ({ ...prev, users: "Unable to load customers" }));
        if (!errorShownRef.current.has("users")) {
          errorShownRef.current.add("users");
          toast.error("Unable to load customers");
        }
      }
    }
  }, [toast]);

  const refreshAll = useCallback(
    async (initial = false) => {
      if (!initial) setRefreshing(true);
      errorShownRef.current.clear();
      await Promise.all([fetchProducts(), fetchCategories(), fetchOrders(), fetchCoupons(), fetchUsers()]);
      if (mountedRef.current) {
        if (initial) {
          setInitializing(false);
        } else {
          setRefreshing(false);
          toast.success("Data refreshed");
        }
      }
    },
    [fetchCategories, fetchCoupons, fetchOrders, fetchProducts, fetchUsers, toast]
  );

  useEffect(() => {
    refreshAll(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     FORM HANDLERS
  ───────────────────────────────────────────────────────────────────────── */

  const resetProductForm = () => {
    setProductForm(defaultProductForm);
    setShowProductForm(false);
  };
  const resetCategoryForm = () => setCategoryForm(defaultCategoryForm);
  const resetCouponForm = () => setCouponForm(defaultCouponForm);

  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProductForm((prev) => ({
      ...prev,
      name,
      slug: prev.id ? prev.slug : generateSlug(name),
    }));
  };

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.name || !productForm.slug || !productForm.price) {
      toast.error("Please fill in name, slug, and price");
      return;
    }
    if (productForm.imageUrls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const parsedRingSizes = productForm.ringSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedBraceletSizes = productForm.braceletSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedPayalSizes = productForm.payalSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: productForm.name.trim(),
      slug: productForm.slug.trim(),
      description: productForm.description.trim() || null,
      specification: productForm.specification.trim() || null,
      supplier_info: productForm.supplierInfo.trim() || null,
      ring_sizes: parsedRingSizes.length ? parsedRingSizes : null,
      bracelet_sizes: parsedBraceletSizes.length ? parsedBraceletSizes : null,
      payal_sizes: parsedPayalSizes.length ? parsedPayalSizes : null,
      price: Number(productForm.price),
      discount_price: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      images: productForm.imageUrls,
      stock: Number(productForm.stock || 0),
      is_featured: productForm.isFeatured,
      category_id: productForm.categoryId || null,
    };

    setSavingProduct(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: productForm.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm.id ? { id: productForm.id, ...payload } : payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(productForm.id ? "Product updated" : "Product created");
      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error("Product save failed", error);
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product: ProductRecord) => {
    setProductForm({
      id: product.id,
      name: product.name ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      specification: product.specification ?? "",
      supplierInfo: product.supplier_info ?? "",
      ringSizes: product.ring_sizes?.join(", ") ?? "",
      braceletSizes: product.bracelet_sizes?.join(", ") ?? "",
      payalSizes: product.payal_sizes?.join(", ") ?? "",
      price: String(product.price ?? ""),
      discountPrice: product.discount_price ? String(product.discount_price) : "",
      imageUrls: product.images ?? [],
      stock: String(product.stock ?? ""),
      isFeatured: Boolean(product.is_featured),
      categoryId: product.category_id ?? "",
    });
    setShowProductForm(true);
    setActiveView("products");
  };

  const confirmDeleteProduct = (id: string, name: string) => {
    setConfirmModal({
      open: true,
      title: "Delete Product",
      message: `Delete "${name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => handleDeleteProduct(id),
      loading: false,
      variant: "danger",
    });
  };

  const handleDeleteProduct = async (id: string) => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Product deleted");
      await fetchProducts();
    } catch (error) {
      console.error("Product delete failed", error);
      toast.error("Unable to delete product");
    } finally {
      setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Please provide name and slug");
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      description: categoryForm.description.trim() || null,
      image: categoryForm.image.trim() || null,
    };

    setSavingCategory(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: categoryForm.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm.id ? { id: categoryForm.id, ...payload } : payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      toast.success(categoryForm.id ? "Category updated" : "Category created");
      resetCategoryForm();
      await fetchCategories();
    } catch (error) {
      console.error("Category save failed", error);
      toast.error(error instanceof Error ? error.message : "Unable to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const confirmDeleteCategory = (id: string, name: string) => {
    setConfirmModal({
      open: true,
      title: "Delete Category",
      message: `Delete "${name}"?`,
      confirmLabel: "Delete",
      onConfirm: () => handleDeleteCategory(id),
      loading: false,
      variant: "danger",
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Category deleted");
      await fetchCategories();
    } catch (error) {
      console.error("Category delete failed", error);
      toast.error("Unable to delete category");
    } finally {
      setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleCouponSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) {
      toast.error("Please provide code and discount value");
      return;
    }

    const payload = {
      code: couponForm.code.trim().toUpperCase(),
      discount_type: couponForm.discountType,
      discount_value: Number(couponForm.discountValue),
      min_purchase: couponForm.minPurchase ? Number(couponForm.minPurchase) : null,
      expires_at: couponForm.expiresAt ? new Date(couponForm.expiresAt).toISOString() : null,
    };

    setSavingCoupon(true);
    try {
      const response = await fetch("/api/admin/coupons", {
        method: couponForm.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponForm.id ? { id: couponForm.id, ...payload } : payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save coupon");
      }

      toast.success(couponForm.id ? "Coupon updated" : "Coupon created");
      resetCouponForm();
      await fetchCoupons();
    } catch (error) {
      console.error("Coupon save failed", error);
      toast.error(error instanceof Error ? error.message : "Unable to save coupon");
    } finally {
      setSavingCoupon(false);
    }
  };

  const confirmDeleteCoupon = (id: string, code: string) => {
    setConfirmModal({
      open: true,
      title: "Delete Coupon",
      message: `Delete coupon "${code}"?`,
      confirmLabel: "Delete",
      onConfirm: () => handleDeleteCoupon(id),
      loading: false,
      variant: "danger",
    });
  };

  const handleDeleteCoupon = async (couponId: string) => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`/api/admin/coupons?id=${couponId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Coupon deleted");
      await fetchCoupons();
    } catch (error) {
      console.error("Coupon delete failed", error);
      toast.error("Unable to delete coupon");
    } finally {
      setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    setOrderUpdatingId(orderId);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast.success("Order updated");
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    } catch (error) {
      console.error("Order update failed", error);
      toast.error("Unable to update order");
    } finally {
      setOrderUpdatingId(null);
    }
  };

  const handleUserRoleChange = async (userId: string, role: "admin" | "customer") => {
    setUserUpdatingId(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast.success("Role updated");
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
      if (profile?.id === userId && role !== "admin") {
        toast.info("Admin access removed. Redirecting...");
        setTimeout(() => router.replace("/"), 2000);
      }
    } catch (error) {
      console.error("Role update failed", error);
      toast.error("Unable to update role");
    } finally {
      setUserUpdatingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  /* ─────────────────────────────────────────────────────────────────────────
     ERROR BANNER
  ───────────────────────────────────────────────────────────────────────── */

  const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm text-red-700">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 self-end sm:self-auto"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER SECTIONS
  ───────────────────────────────────────────────────────────────────────── */

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">
                {formatCurrency(dashboardStats.totalRevenue || 0)}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">{dashboardStats.pendingOrders}</p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Products</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">{dashboardStats.productCount}</p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Customers</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">{dashboardStats.customerCount}</p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => setActiveView("orders")}
              className="text-xs sm:text-sm text-amber-600 font-semibold hover:text-amber-700"
            >
              View all
            </button>
          </div>
          {dataErrors.orders ? (
            <ErrorBanner message={dataErrors.orders} onRetry={fetchOrders} />
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {order.items?.[0]?.name ?? `Order #${order.id.slice(0, 6)}`}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(Number(order.total_amount ?? 0))}
                    </p>
                    <span
                      className={`inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full capitalize ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Low Stock</h3>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {dashboardStats.lowStockItems}
            </span>
          </div>
          {dataErrors.products ? (
            <ErrorBanner message={dataErrors.products} onRetry={fetchProducts} />
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-6">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All stocked up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.slug}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700 ml-2">
                    {product.stock ?? 0} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <button
          onClick={() => {
            setProductForm(defaultProductForm);
            setShowProductForm(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {dataErrors.products && <ErrorBanner message={dataErrors.products} onRetry={fetchProducts} />}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {productForm.id ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={resetProductForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.name}
                    onChange={handleProductNameChange}
                    placeholder="Diamond Ring"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm lowercase focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.slug}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="diamond-ring"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Beautiful handcrafted jewelry..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Specifications</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.specification}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, specification: e.target.value }))
                    }
                    placeholder="Metal, purity, finish, hallmark, care..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Supplier Information</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.supplierInfo}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, supplierInfo: e.target.value }))
                    }
                    placeholder="Workshop location, sourcing, authenticity notes..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ring sizes (comma separated)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.ringSizes}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, ringSizes: e.target.value }))}
                    placeholder="6, 7, 8, 9"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Bracelet sizes (comma separated)
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.braceletSizes}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, braceletSizes: e.target.value }))
                    }
                    placeholder='6.5", 7", 7.5"'
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Payal sizes (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={productForm.payalSizes}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, payalSizes: e.target.value }))}
                  placeholder='8", 9", 10"'
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.price}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="999"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sale Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, discountPrice: e.target.value }))}
                    placeholder="799"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Images <span className="text-red-500">*</span>
                </label>
                <ImageUploader
                  images={productForm.imageUrls}
                  onImagesChange={(images) => setProductForm((prev) => ({ ...prev, imageUrls: images }))}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Featured product</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={16} />}
                  {productForm.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search products..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
              {product.is_featured && (
                <span className="absolute top-2 left-2 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <span
                className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full ${
                  (product.stock ?? 0) < 5 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {product.stock ?? 0} in stock
              </span>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {categoryLookup.get(product.category_id ?? "") || "Uncategorized"}
              </p>
              <h4 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-gray-900">{formatCurrency(Number(product.price ?? 0))}</span>
                {product.discount_price && (
                  <span className="text-xs text-red-500 line-through">
                    {formatCurrency(Number(product.discount_price))}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => window.open(`/shop/${product.slug}`, "_blank")}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50"
                >
                  <Eye size={12} />
                </button>
                <button
                  onClick={() => confirmDeleteProduct(product.id, product.name)}
                  className="px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !dataErrors.products && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">{categories.length} categories</p>
        </div>
      </div>

      {dataErrors.categories && <ErrorBanner message={dataErrors.categories} onRetry={fetchCategories} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{category.name}</p>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() =>
                    setCategoryForm({
                      id: category.id,
                      name: category.name,
                      slug: category.slug,
                      description: category.description ?? "",
                      image: category.image ?? "",
                    })
                  }
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => confirmDeleteCategory(category.id, category.name)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && !dataErrors.categories && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No categories yet</p>
            </div>
          )}
        </div>

        {/* Category Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">
            {categoryForm.id ? "Edit Category" : "New Category"}
          </h3>
          <form onSubmit={handleCategorySubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : generateSlug(name),
                  }));
                }}
                placeholder="Rings"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Slug *</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm lowercase"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="rings"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Image URL</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                value={categoryForm.image}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              {categoryForm.id && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={savingCategory}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingCategory && <Loader2 className="w-4 h-4 animate-spin" />}
                {categoryForm.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {dataErrors.orders && <ErrorBanner message={dataErrors.orders} onRetry={fetchOrders} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Order</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-500 sm:hidden">{formatDate(order.created_at)}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(Number(order.total_amount ?? 0))}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                      disabled={orderUpdatingId === order.id}
                      className={`rounded-lg border px-2 py-1 text-xs font-semibold capitalize ${
                        order.status === "delivered"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : order.status === "cancelled"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : order.status === "pending"
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      } disabled:opacity-50`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !dataErrors.orders && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Coupons</h2>
        <p className="text-sm text-gray-500">{coupons.length} active coupons</p>
      </div>

      {dataErrors.coupons && <ErrorBanner message={dataErrors.coupons} onRetry={fetchCoupons} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coupon List */}
        <div className="lg:col-span-2 space-y-3">
          {coupons.map((coupon) => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-xl border shadow-sm p-4 ${isExpired ? "border-red-200 bg-red-50/50" : "border-gray-100"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                      {isExpired && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">Expired</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% off`
                        : `₹${coupon.discount_value} off`}
                      {coupon.min_purchase && ` • Min ₹${coupon.min_purchase}`}
                    </p>
                    {coupon.expires_at && (
                      <p className="text-xs text-gray-500 mt-1">Expires {formatDate(coupon.expires_at)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCouponForm({
                          id: coupon.id,
                          code: coupon.code,
                          discountType: coupon.discount_type,
                          discountValue: String(coupon.discount_value),
                          minPurchase: coupon.min_purchase ? String(coupon.min_purchase) : "",
                          expiresAt: coupon.expires_at ? coupon.expires_at.slice(0, 10) : "",
                        })
                      }
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => confirmDeleteCoupon(coupon.id, coupon.code)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {coupons.length === 0 && !dataErrors.coupons && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No coupons yet</p>
            </div>
          )}
        </div>

        {/* Coupon Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">{couponForm.id ? "Edit Coupon" : "New Coupon"}</h3>
          <form onSubmit={handleCouponSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Code *</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm uppercase"
                value={couponForm.code}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="SUMMER20"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  value={couponForm.discountType}
                  onChange={(e) =>
                    setCouponForm((prev) => ({ ...prev, discountType: e.target.value as "flat" | "percentage" }))
                  }
                >
                  <option value="percentage">%</option>
                  <option value="flat">₹</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Value *</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                  placeholder="20"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Min Purchase (₹)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                value={couponForm.minPurchase}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, minPurchase: e.target.value }))}
                placeholder="500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expires</label>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                value={couponForm.expiresAt}
                onChange={(e) => setCouponForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-2">
              {couponForm.id && (
                <button
                  type="button"
                  onClick={resetCouponForm}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={savingCoupon}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingCoupon && <Loader2 className="w-4 h-4 animate-spin" />}
                {couponForm.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h2>
        <p className="text-sm text-gray-500">{users.length} registered users</p>
      </div>

      {dataErrors.users && <ErrorBanner message={dataErrors.users} onRetry={fetchUsers} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((userRecord) => (
                <tr key={userRecord.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(userRecord.full_name || userRecord.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {userRecord.full_name ?? userRecord.name ?? "Unnamed"}
                          {userRecord.id === profile?.id && (
                            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">#{userRecord.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={userRecord.role ?? "customer"}
                      onChange={(e) => handleUserRoleChange(userRecord.id, e.target.value as "admin" | "customer")}
                      disabled={userUpdatingId === userRecord.id}
                      className={`rounded-lg border px-2 py-1 text-xs font-semibold capitalize ${
                        userRecord.role === "admin"
                          ? "bg-purple-50 border-purple-200 text-purple-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      } disabled:opacity-50`}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{formatDate(userRecord.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && !dataErrors.users && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users yet</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────────────────
     NAVIGATION
  ───────────────────────────────────────────────────────────────────────── */

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "users", label: "Users", icon: Users },
  ] as const;

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "categories":
        return renderCategories();
      case "orders":
        return renderOrders();
      case "coupons":
        return renderCoupons();
      case "users":
        return renderUsers();
      default:
        return null;
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     LOADING STATE
  ───────────────────────────────────────────────────────────────────────── */

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     MAIN LAYOUT
  ───────────────────────────────────────────────────────────────────────── */

  return (
    <>
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        loading={confirmModal.loading}
        variant={confirmModal.variant}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-500">Ganraj</p>
              <h1 className="text-xl font-bold text-gray-900">Admin</h1>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveView(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeView === id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex bg-slate-50">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-white border-r border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-500">Ganraj</p>
            <h1 className="text-xl font-bold text-gray-900">Admin Studio</h1>
            <p className="text-xs text-gray-500 mt-1 truncate">{profile?.fullName || "Admin"}</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeView === id ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-100 space-y-2">
            <button
              onClick={() => refreshAll(false)}
              disabled={refreshing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw size={16} />}
              Refresh
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900">Admin</h1>
            <button
              onClick={() => refreshAll(false)}
              disabled={refreshing}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              {refreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
            </button>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </>
  );
}
