"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: any; // Sanity image object or URL
    description?: string;
    slug?: { current: string } | string;
    selectedOptions?: Record<string, string[]>;
    specialInstructions?: string;
    maxStock?: number;
}

// ... (CustomerInfo interface remains same)

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    customer?: CustomerInfo | null;
    setCustomer?: (c: CustomerInfo | null) => void;
    deliveryMethod: 'delivery';
    setDeliveryMethod: (method: 'delivery') => void;
    deliveryPrice: number;
    setDeliveryPrice: (price: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on initial mount
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [customer, setCustomer] = useState<CustomerInfo | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery'>('delivery'); // Only delivery, no pickup
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    // Hydrate from localStorage after component mounts
    useEffect(() => {
        const savedCart = localStorage.getItem('baby-heaven-cart');
        if (savedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart:', e);
            }
        }

        const savedCustomer = localStorage.getItem('baby-heaven-customer');
        if (savedCustomer) {
            try {
                const parsed = JSON.parse(savedCustomer);
                // Only restore name and phone, not address or payment info
                setCustomer({
                    name: parsed.name,
                    phone: parsed.phone,
                });
            } catch (e) {
                console.error('Error loading customer info:', e);
            }
        }

        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            if (items.length > 0) {
                localStorage.setItem('baby-heaven-cart', JSON.stringify(items));
            } else {
                localStorage.removeItem('baby-heaven-cart');
            }
        }
    }, [items, isHydrated]);

    // Save customer info to localStorage (only name and phone)
    useEffect(() => {
        if (isHydrated) {
            if (customer && (customer.name || customer.phone)) {
                const toSave = {
                    name: customer.name,
                    phone: customer.phone,
                };
                localStorage.setItem('baby-heaven-customer', JSON.stringify(toSave));
            } else {
                localStorage.removeItem('baby-heaven-customer');
            }
        }
    }, [customer, isHydrated]);

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const quantityToAdd = item.quantity || 1;

        setItems(currentItems => {
            const itemId = item.id || item._id;
            // For products with options, create unique ID based on options
            const optionsKey = item.selectedOptions
                ? JSON.stringify(item.selectedOptions)
                : '';
            const uniqueId = `${itemId}-${optionsKey}`;

            const existingItemIndex = currentItems.findIndex(i => i.id === uniqueId);

            if (existingItemIndex >= 0) {
                const newItems = [...currentItems];
                const currentQuantity = newItems[existingItemIndex].quantity;
                const maxStock = newItems[existingItemIndex].maxStock || 999;

                // Check if adding would exceed stock
                if (currentQuantity + quantityToAdd > maxStock) {
                    alert(`Solo puedes agregar hasta ${maxStock} unidades de este producto.`);
                    return currentItems;
                }

                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: currentQuantity + quantityToAdd
                };
                return newItems;
            }
            return [...currentItems, { ...item, id: uniqueId, quantity: quantityToAdd }];
        });
        setIsOpen(true); // Open cart when adding item
    };

    const removeFromCart = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item => {
                if (item.id === id) {
                    // Check max stock
                    if (item.maxStock && quantity > item.maxStock) {
                        return item; // Do not update if exceeds stock
                    }
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isOpen,
                setIsOpen,
                customer,
                setCustomer,
                deliveryMethod,
                setDeliveryMethod,
                deliveryPrice,
                setDeliveryPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
