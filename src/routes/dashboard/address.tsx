import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Globe, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { addAddress, getUserAddresses, updateAddress, deleteAddress, getReadableErrorMessage } from "@/lib/api";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
}

export default function DashboardAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    type: "home",
    fullAddress: "",
    city: "",
    pincode: "",
    country: "India",
  });

  const fetchAddressesList = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses();
      // Map backend addresses to UI Address schema
      const mapped = data.map((addr: any) => ({
        id: addr._id,
        type: addr.type || "home",
        fullAddress: addr.fullAddress || "",
        city: addr.city || "",
        pincode: addr.pincode || "",
        country: addr.country || "India",
      }));
      setAddresses(mapped);
    } catch (error: any) {
      console.error(error);
      // If no address is saved, backend might return empty array, handle gracefully
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressesList();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveAddress = async () => {
    if (!formData.fullAddress) {
      toast.error("Please enter your full address.");
      return;
    }
    if (!formData.city) {
      toast.error("Please enter your city.");
      return;
    }
    if (!formData.pincode) {
      toast.error("Please enter your pincode.");
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
        toast.success("Address updated successfully");
      } else {
        // Add address to backend
        await addAddress(formData);
        toast.success("Address added successfully");
      }
      await fetchAddressesList();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(getReadableErrorMessage(error));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully");
      await fetchAddressesList();
    } catch (error: any) {
      toast.error(getReadableErrorMessage(error));
    }
  };

  const resetForm = () => {
    setFormData({
      type: "home",
      fullAddress: "",
      city: "",
      pincode: "",
      country: "India",
    });
    setEditingAddress(null);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      fullAddress: address.fullAddress,
      city: address.city,
      pincode: address.pincode,
      country: address.country,
    });
    setIsAddModalOpen(true);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return MapPin;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Saved Addresses</h1>
          <p className="text-muted-foreground mt-1">Manage your shipping and billing addresses.</p>
        </div>

        <Dialog
          open={isAddModalOpen}
          onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto rounded-full gap-2 shadow-lg hover:shadow-primary/20 transition-all px-6">
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="pt-10 px-8 pb-6 bg-[#f8f9f8]">
              <DialogTitle className="text-3xl font-display font-medium text-center">
                Add New <span className="italic text-primary">Address</span>
              </DialogTitle>
            </DialogHeader>
            <div className="px-8 py-8 space-y-6 bg-white">
              <div className="space-y-2">
                <Label
                  htmlFor="fullAddress"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Full Address
                </Label>
                <Input
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="e.g. 123 Street, Area"
                  className="rounded-2xl h-14 border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Delhi"
                    className="rounded-2xl h-14 border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="pincode"
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="110001"
                    className="rounded-2xl h-14 border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="India"
                  className="rounded-2xl h-14 border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
                />
              </div>
            </div>
            <div className="px-8 pb-10 flex flex-col gap-3 bg-white">
              <Button
                onClick={handleSaveAddress}
                className="rounded-2xl h-14 text-base font-bold bg-primary hover:bg-primary-glow shadow-lg shadow-primary/20"
              >
                Save Address
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-2xl h-14 text-sm font-bold text-muted-foreground hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100/50">
          <Loader className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {addresses.map((address) => {
              const Icon = getAddressIcon(address.type);
              return (
                <motion.div
                  key={address.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-soft hover:shadow-elegant transition-all group h-full">
                    <CardContent className="p-5 sm:p-8">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(address)}
                            className="h-10 w-10 rounded-full hover:bg-slate-50 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-destructive/5 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this address from your account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="rounded-xl bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Address
                          </p>
                          <p className="font-medium text-foreground">{address.fullAddress}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              City
                            </p>
                            <p className="text-sm font-medium">{address.city}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              Pincode
                            </p>
                            <p className="text-sm font-medium">{address.pincode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-50 text-muted-foreground">
                          <Globe className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{address.country}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {addresses.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 stroke-1 opacity-20" />
              <p className="text-muted-foreground font-medium">
                No saved addresses. Add one to get started!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
