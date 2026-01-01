import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getUserWishlist,
  removeFromWishlist,
} from "@/api/user.api";
import { createQuery } from "@/api/query.api";
import { createReview } from "@/api/review.api";
import { getProducts } from "@/api/product.api";
import { getEnabledProfilePages, getProfilePageBySlug } from "@/api/profilepage.api";
import { useToast } from "@/components/ui/toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  User,
  Package,
  MapPin,
  Heart,
  MessageSquare,
  Star,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import type { UserProfile as UserProfileType, Address, Order } from "@/api/user.api";

type TabType = "dashboard" | "profile" | "addresses" | "orders" | "wishlist" | "queries" | "reviews" | string;

export default function UserProfile() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [profilePages, setProfilePages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    loadData();
  }, [authUser, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, addressesData, ordersData, wishlistData, profilePagesData] = await Promise.all([
        getUserProfile().catch((err) => {
          console.error("Failed to load profile:", err);
          return null;
        }),
        getUserAddresses().catch((err) => {
          console.error("Failed to load addresses:", err);
          // Fallback to localStorage if backend fails
          try {
            const savedAddresses = localStorage.getItem("savedAddresses");
            if (savedAddresses) {
              const parsed = JSON.parse(savedAddresses);
              return Array.isArray(parsed) ? parsed : [];
            }
          } catch (e) {
            console.error("Failed to load addresses from localStorage:", e);
          }
          return [];
        }),
        getUserOrders().catch((err) => {
          console.error("Failed to load orders:", err);
          return [];
        }),
        getUserWishlist().catch((err) => {
          console.error("Failed to load wishlist:", err);
          return [];
        }),
        getEnabledProfilePages().catch((err) => {
          console.error("Failed to load profile pages:", err);
          return [];
        }),
      ]);
      
      if (profileData) setProfile(profileData);
      console.log("Loaded addresses:", addressesData);
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      
      // Handle profile pages data
      console.log("Profile pages API response:", profilePagesData);
      if (Array.isArray(profilePagesData)) {
        setProfilePages(profilePagesData);
        console.log(`Loaded ${profilePagesData.length} enabled profile pages`);
      } else if (profilePagesData && Array.isArray(profilePagesData.data)) {
        setProfilePages(profilePagesData.data);
        console.log(`Loaded ${profilePagesData.data.length} enabled profile pages`);
      } else {
        console.warn("Invalid profile pages data format:", profilePagesData);
        setProfilePages([]);
      }
    } catch (err: any) {
      console.error("Error loading data:", err);
      error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Base tabs
  const baseTabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: User },
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "addresses" as TabType, label: "Addresses", icon: MapPin },
    { id: "orders" as TabType, label: "Orders", icon: Package },
    { id: "wishlist" as TabType, label: "Wishlist", icon: Heart },
    { id: "queries" as TabType, label: "Support", icon: MessageSquare },
    { id: "reviews" as TabType, label: "Reviews", icon: Star },
  ];

  // Add profile pages as tabs - only enabled pages
  const profilePageTabs = profilePages
    .filter((page: any) => page.enabled === true)
    .map((page: any) => ({
      id: `profile-page-${page._id}` as TabType,
      label: page.title,
      icon: FileText,
      isProfilePage: true,
      pageData: page,
    }));

  const tabs = [...baseTabs, ...profilePageTabs];
  
  // Debug: Log tabs when profile pages change
  useEffect(() => {
    console.log("=== Profile Pages Debug ===");
    console.log("Total profile pages from API:", profilePages.length);
    console.log("Enabled profile pages:", profilePages.filter((p: any) => p.enabled === true).length);
    if (profilePages.length > 0) {
      profilePages.forEach((page: any, index: number) => {
        console.log(`Page ${index + 1}:`, {
          title: page.title,
          id: page._id,
          enabled: page.enabled,
          slug: page.slug
        });
      });
    } else {
      console.log("No profile pages found. Create and enable them in SP Panel → Profile Pages.");
    }
    console.log("Total tabs (including profile pages):", tabs.length);
  }, [profilePages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-gray-700">
                  {profile?.name?.charAt(0).toUpperCase() || authUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-center font-semibold text-gray-900">{profile?.name || authUser?.name}</h3>
              <p className="text-center text-sm text-gray-600">{profile?.email || authUser?.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={activeTab === tab.id ? { backgroundColor: "var(--theme-primary)" } : {}}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === "dashboard" && <DashboardTab orders={orders} addresses={addresses} wishlist={wishlist} />}
            {activeTab === "profile" && <ProfileTab profile={profile} onUpdate={loadData} />}
            {activeTab === "addresses" && <AddressesTab addresses={addresses} onUpdate={loadData} />}
            {activeTab === "orders" && <OrdersTab orders={orders} onUpdate={loadData} />}
            {activeTab === "wishlist" && <WishlistTab wishlist={wishlist} onUpdate={loadData} />}
            {activeTab === "queries" && <QueriesTab />}
            {activeTab === "reviews" && <ReviewsTab orders={orders} />}
            {/* Profile Pages */}
            {activeTab.startsWith("profile-page-") && (() => {
              const pageId = activeTab.replace("profile-page-", "");
              const page = profilePages.find((p: any) => p._id === pageId);
              console.log("Rendering profile page:", { pageId, page, allPages: profilePages });
              if (!page) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Profile page not found.</p>
                  </div>
                );
              }
              return (
                <div>
                  <h2 className="text-2xl font-bold mb-6 theme-heading">{page.title}</h2>
                  {page.subInfo && (
                    <p className="text-gray-600 mb-4">{page.subInfo}</p>
                  )}
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: page.content || "<p>No content available.</p>" }}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ orders, addresses, wishlist }: { orders: Order[]; addresses: Address[]; wishlist: any[] }) {
  const recentOrders = orders.slice(0, 3);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="theme-bg-light p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-1">Pending Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-1">Saved Addresses</h3>
          <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-600">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order._id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-900">${order.bill.toFixed(2)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "Complete" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Package size={24} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-700">View All Orders</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <MapPin size={24} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-700">Manage Addresses</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Heart size={24} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-700">Wishlist ({wishlist.length})</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <MessageSquare size={24} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-700">Get Support</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ profile, onUpdate }: { profile: UserProfileType | null; onUpdate: () => void }) {
  const { success, error } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(formData);
      success("Profile updated successfully!");
      setEditing(false);
      onUpdate();
    } catch (err: any) {
      error(err.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      error("Please fill in all password fields");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("New passwords do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      error("New password must be at least 6 characters long");
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (err: any) {
      error(err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile Settings</h2>
      
      {/* Profile Info */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 theme-button rounded-lg"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>
        
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg p-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg p-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg p-2 text-gray-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 theme-button rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({ name: profile?.name || "", email: profile?.email || "", phone: profile?.phone || "" });
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-900"><strong className="text-gray-700">Name:</strong> {profile?.name || "N/A"}</p>
            <p className="text-gray-900"><strong className="text-gray-700">Email:</strong> {profile?.email || "N/A"}</p>
            <p className="text-gray-900"><strong className="text-gray-700">Phone:</strong> {profile?.phone || "N/A"}</p>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full border rounded-lg p-2 pr-10 text-gray-900"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full border rounded-lg p-2 pr-10 text-gray-900"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full border rounded-lg p-2 pr-10 text-gray-900"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="theme-button px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Addresses Tab Component
function AddressesTab({ addresses, onUpdate }: { addresses: Address[]; onUpdate: () => void }) {
  const { success, error } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, "_id">>({
    firstName: "",
    lastName: "",
    province: "",
    city: "",
    area: "",
    postalCode: "",
    phone: "",
    line1: "",
    isDefault: false,
  });

  const handleAdd = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.line1 || !formData.city || !formData.province || !formData.postalCode) {
      error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addUserAddress(formData);
      success("Address added successfully!");
      setShowAddForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        province: "",
        city: "",
        area: "",
        postalCode: "",
        phone: "",
        line1: "",
        isDefault: false,
      });
      onUpdate();
    } catch (err: any) {
      error(err.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (addressId: string) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await updateUserAddress(addressId, formData);
      success("Address updated successfully!");
      setEditingId(null);
      onUpdate();
    } catch (err: any) {
      error(err.message || "Failed to update address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const handleDelete = (addressId: string) => {
    setDeleteConfirm(addressId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUserAddress(deleteConfirm);
      success("Address deleted successfully!");
      setDeleteConfirm(null);
      onUpdate();
    } catch (err: any) {
      error(err.message || "Failed to delete address");
      setDeleteConfirm(null);
    }
  };

  const startEdit = (address: Address) => {
    setEditingId(address._id || null);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      province: address.province,
      city: address.city,
      area: address.area || "",
      postalCode: address.postalCode,
      phone: address.phone,
      line1: address.line1,
      isDefault: address.isDefault || false,
    });
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="theme-button flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4 text-gray-900">Add New Address</h3>
          <AddressForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleAdd}
            isSubmitting={isSubmitting}
            onCancel={() => {
              setShowAddForm(false);
              setFormData({
                firstName: "",
                lastName: "",
                province: "",
                city: "",
                area: "",
                postalCode: "",
                phone: "",
                line1: "",
                isDefault: false,
              });
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div>
            <p className="text-gray-600 mb-2">No addresses saved yet</p>
            <p className="text-sm text-gray-500">Add your first address using the button above</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="border rounded-lg p-4">
              {editingId === address._id ? (
                <AddressForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={() => handleUpdate(address._id!)}
                  isSubmitting={isSubmitting}
                  onCancel={() => {
                    setEditingId(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      province: "",
                      city: "",
                      area: "",
                      postalCode: "",
                      phone: "",
                      line1: "",
                      isDefault: false,
                    });
                  }}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {address.isDefault && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-2">
                          Default
                        </span>
                      )}
                      <p className="font-semibold text-gray-900">{address.firstName} {address.lastName}</p>
                      <p className="text-sm text-gray-700">{address.line1}</p>
                      {address.area && <p className="text-sm text-gray-700">{address.area}</p>}
                      <p className="text-sm text-gray-700">{address.city}, {address.province}</p>
                      <p className="text-sm text-gray-700">Postal: {address.postalCode}</p>
                      <p className="text-sm text-gray-700">Phone: {address.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(address)}
                        className="p-2 theme-text-primary rounded hover:bg-gray-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Address Form Component
function AddressForm({
  formData,
  setFormData,
  onSave,
  onCancel,
  isSubmitting = false,
}: {
  formData: Omit<Address, "_id">;
  setFormData: (data: Omit<Address, "_id">) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full border rounded-lg p-2 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full border rounded-lg p-2 text-gray-900"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Phone *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border rounded-lg p-2 text-gray-900"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Address Line 1 *</label>
        <input
          type="text"
          value={formData.line1}
          onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
          className="w-full border rounded-lg p-2 text-gray-900"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Area</label>
        <input
          type="text"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          className="w-full border rounded-lg p-2 text-gray-900"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full border rounded-lg p-2 text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Province *</label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            className="w-full border rounded-lg p-2 text-gray-900"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Postal Code *</label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          className="w-full border rounded-lg p-2 text-gray-900"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="w-4 h-4"
        />
        <label className="text-sm text-gray-700">Set as default address</label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="theme-button px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, onUpdate }: { orders: Order[]; onUpdate: () => void }) {
  const { success, error } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "complete":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancel":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = async (orderId: string) => {
    try {
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
      setShowDetailsModal(true);
    } catch (err: any) {
      error(err.message || "Failed to load order details");
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setCancelConfirm(orderId);
  };

  const confirmCancelOrder = async () => {
    if (!cancelConfirm) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancelConfirm);
      success("Order cancelled successfully! Admin has been notified.");
      setCancelConfirm(null);
      onUpdate(); // Refresh orders list
    } catch (err: any) {
      error(err.message || "Failed to cancel order");
      setCancelConfirm(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm mb-2 text-gray-900"><strong className="text-gray-700">Items:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-900">
                      {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Total:</strong> ${order.bill.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Payment:</strong> {order.payment}
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="px-4 py-2 theme-button rounded-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{selectedOrder._id}</p>
                  <p className="text-sm text-gray-600 mt-2">Order Date</p>
                  <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <p className="text-sm text-gray-900"><strong className="text-gray-700">Name:</strong> {selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-900"><strong className="text-gray-700">Phone:</strong> {selectedOrder.phoneNumber}</p>
                </div>

                {/* Address */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.address.line1}<br />
                    {selectedOrder.address.area && `${selectedOrder.address.area}, `}
                    {selectedOrder.address.city}, {selectedOrder.address.province}<br />
                    {selectedOrder.address.postalCode}
                  </p>
                </div>

                {/* Items */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-900">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Total */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Payment Method:</span>
                    <span className="text-gray-900 font-medium">{selectedOrder.payment}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">${selectedOrder.bill.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wishlist Tab Component
function WishlistTab({ wishlist, onUpdate }: { wishlist: any[]; onUpdate: () => void }) {
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      success("Removed from wishlist");
      onUpdate();
    } catch (err: any) {
      error(err.message || "Failed to remove from wishlist");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((product) => {
            // Calculate discounted price if discount exists
            const discount = product.discount || 0;
            const originalPrice = product.price;
            const discountedPrice = discount > 0 
              ? originalPrice * (1 - discount / 100)
              : originalPrice;

            return (
              <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {/* Product Image */}
                {product.image1 && (
                  <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image1}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold mb-2 text-gray-900 text-base line-clamp-2 min-h-[3rem]">{product.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {discount > 0 ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm text-gray-500 line-through">
                          ${Math.round(originalPrice)}
                        </span>
                        <span className="text-lg font-bold theme-text-primary">
                          ${Math.round(discountedPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold theme-text-primary">
                        ${Math.round(originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="flex-1 px-3 py-2 theme-button rounded-lg text-sm font-medium whitespace-nowrap"
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="px-3 py-2 border-2 border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex-shrink-0"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Queries Tab Component
function QueriesTab() {
  const { success, error } = useToast();
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState({
    email: authUser?.email || "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.subject || !formData.description) {
      error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await createQuery(formData);
      success("Your query has been submitted successfully!");
      setFormData({ 
        email: authUser?.email || "", 
        subject: "", 
        description: "" 
      });
    } catch (err: any) {
      error(err?.response?.data?.message || "Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Support & Help</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-gray-900">Need Help?</h3>
          <p className="text-gray-700 mb-4">Contact our support team for assistance with your orders or account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter here"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter here"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter here"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] resize-none text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 theme-button rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-gray-900">Live Chat</h3>
          <p className="text-gray-700 mb-4">Chat with us in real-time for instant support.</p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// Reviews Tab Component
function ReviewsTab({ orders }: { orders: Order[] }) {
  const { success, error } = useToast();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; orderId: string; productId?: string } | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Only show products from completed orders
  const completedOrders = orders.filter(o => o.status === "Complete" || o.status === "Completed");
  
  const handleWriteReview = (item: { name: string; quantity: number; price: number }, orderId: string) => {
    // Try to find product ID from the item (if available)
    setSelectedProduct({
      name: item.name,
      orderId: orderId,
      productId: (item as any).productId || (item as any).id || undefined,
    });
    setShowReviewModal(true);
    setReviewData({ rating: 0, comment: "" });
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct) return;

    if (reviewData.rating === 0) {
      error("Please select a rating");
      return;
    }

    if (!reviewData.comment.trim()) {
      error("Please write a review comment");
      return;
    }

    setSubmitting(true);
    try {
      // If productId is not available, search for it by product name
      let productId: string | undefined = selectedProduct.productId;
      if (!productId) {
        const products = await getProducts();
        const product = products.find((p: any) => p.name === selectedProduct.name);
        if (!product) {
          error("Product not found. Please contact support.");
          setSubmitting(false);
          return;
        }
        productId = product._id;
      }

      if (!productId) {
        error("Product ID is required. Please contact support.");
        setSubmitting(false);
        return;
      }

      await createReview({
        productId: productId,
        productName: selectedProduct.name,
        orderId: selectedProduct.orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      success("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewData({ rating: 0, comment: "" });
      setSelectedProduct(null);
    } catch (err: any) {
      error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Reviews</h2>
      {completedOrders.length === 0 ? (
        <p className="text-gray-600">You haven't completed any orders yet. Reviews are available after order completion.</p>
      ) : (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <p className="font-semibold mb-2 text-gray-900">Order #{order._id.substring(0, 8)}</p>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleWriteReview(item, order._id)}
                      className="px-4 py-2 theme-button rounded-lg text-sm"
                    >
                      Write Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Write Review</h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedProduct(null);
                  setReviewData({ rating: 0, comment: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-900 font-medium mb-2">Product: {selectedProduct.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={star <= reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Your Review</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] text-gray-900 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedProduct(null);
                  setReviewData({ rating: 0, comment: "" });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex-1 px-4 py-2 theme-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

