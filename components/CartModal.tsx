"use client";
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '@/lib/sanity';
import LocationPicker from './LocationPicker';
import { hondurasStates } from '@/lib/hondurasData';
import { upload } from '@vercel/blob/client';
import { compressImage } from '@/lib/imageUtils';
import { useRouter } from 'next/navigation';
import { calculateDeliveryPrice, formatPrice } from '@/lib/deliveryUtils';

export default function CartModal({ settings }: { settings?: any }) {
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, customer, setCustomer, deliveryPrice, setDeliveryPrice } = useCart();
    const [currentStep, setCurrentStep] = useState<'cart' | 'checkout'>('cart');
    const [isHydrated, setIsHydrated] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const [transferImage, setTransferImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const prevIsOpenRef = useRef(isOpen);


    // Update delivery price when modal opens or location changes
    useEffect(() => {
        if (isOpen && customer?.deliveryCoords) {
            const price = calculateDeliveryPrice(customer.deliveryCoords.lat, customer.deliveryCoords.lng);
            setDeliveryPrice(price);
        } else if (isOpen && !customer?.deliveryCoords) {
            // Default to 105 if no coords (nationwide/outside)
            setDeliveryPrice(105);
        }
    }, [isOpen, customer?.deliveryCoords, setDeliveryPrice]);

    // Get available cities based on selected state
    const availableCities = customer?.state
        ? hondurasStates.find(s => s.name === customer.state)?.cities || []
        : [];

    // Check if La Ceiba is selected
    const isLaCeibaSelected = customer?.city === 'La Ceiba' && customer?.state === 'Atlántida';

    useEffect(() => {
        if (isOpen) {
            setCurrentStep('cart');
        }
    }, [isOpen]);

    useEffect(() => {
        const wasOpen = prevIsOpenRef.current;
        prevIsOpenRef.current = isOpen;

        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else if (wasOpen && !isOpen) {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);

            if (setCustomer && customer) {
                const { address, deliveryCoords, ...rest } = customer;
                setCustomer(rest);
            }
            setDeliveryPrice(settings?.shippingInfo?.defaultShippingCost || 120);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen, setCustomer, setDeliveryPrice, customer, settings]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let phoneNumber = settings?.phone ? settings.phone.replace(/\\D/g, '') : '50400000000';
        if (phoneNumber.length === 8) phoneNumber = '504' + phoneNumber;

        const errors: any = {};
        if (!customer?.name?.trim()) errors.name = 'El nombre completo es requerido';
        if (!customer?.phone?.trim()) errors.phone = 'El teléfono es requerido';
        if (!customer?.state) errors.state = 'Seleccione el departamento';
        if (!customer?.city) errors.city = 'Seleccione la ciudad';
        if (!customer?.address?.trim()) errors.address = 'La dirección es requerida';
        if (!customer?.paymentMethod) errors.paymentMethod = 'Seleccione un método de pago';
        if (customer?.paymentMethod === 'transfer' && !uploadedImageUrl) {
            errors.transferImage = 'Suba el comprobante de transferencia';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        let message = '¡Hola! Me gustaría hacer un pedido:\\n\\n';
        if (customer) {
            message += `*INFORMACIÓN DEL CLIENTE:*\\n`;
            message += `Nombre: ${customer.name}\\n`;
            message += `Teléfono: ${customer.phone}\\n`;
            message += `Estado: ${customer.state}\\n`;
            message += `Ciudad: ${customer.city}\\n`;
            message += `Dirección: ${customer.address}\\n`;
            if (customer.notes) message += `Notas: ${customer.notes}\\n`;
            message += '\\n';
        }

        message += `*PRODUCTOS:*\\n`;
        items.forEach(item => {
            message += `• ${item.name}\\n`;
            if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
                Object.entries(item.selectedOptions).forEach(([optionName, values]) => {
                    message += `  ${optionName}: ${values.join(', ')}\\n`;
                });
            }
            message += `  Cantidad: ${item.quantity}\\n`;
            message += `  Precio: L. ${item.price.toFixed(2)}\\n`;
            message += `  Subtotal: L. ${(item.price * item.quantity).toFixed(2)}\\n\\n`;
        });

        message += `*Subtotal: L. ${totalPrice.toFixed(2)}*\\n`;
        message += `*Envío: L. ${deliveryPrice.toFixed(2)}*\\n`;
        message += `*Total: L. ${(totalPrice + deliveryPrice).toFixed(2)}*\\n\\n`;

        if (customer?.paymentMethod) {
            message += `*MÉTODO DE PAGO:*\\n`;
            if (customer.paymentMethod === 'cash') {
                message += `Efectivo\\n`;
                if (customer.cashChange) message += `Cambio de: ${customer.cashChange}\\n`;
            } else if (customer.paymentMethod === 'transfer') {
                message += `Transferencia Bancaria\\n`;
                const banks = settings?.paymentMethods?.banks || [];
                const selectedBank = banks.find((b: any) => b.bankName === customer.selectedBank);
                if (selectedBank) {
                    message += `Banco: ${selectedBank.bankName}\\n`;
                    message += `Cuenta: ${selectedBank.accountNumber}\\n`;
                    message += `Titular: ${selectedBank.accountHolder}\\n`;
                }
            }
        }

        if (uploadedImageUrl) {
            message += `\\n*Comprobante:* ${uploadedImageUrl}\\n`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const onCustomerChange = (key: string, value: string) => {
        if (!setCustomer) return;

        const updates: any = { [key]: value };

        // Reset city when state changes
        if (key === 'state') {
            updates.city = '';
            updates.address = '';
            updates.deliveryCoords = undefined;
        }

        // Reset address when city changes
        if (key === 'city') {
            updates.address = '';
            updates.deliveryCoords = undefined;
        }

        setCustomer({ ...(customer || {}), ...updates });

        if (formErrors[key]) {
            setFormErrors((prev: any) => ({ ...prev, [key]: undefined }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white z-[150] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                {currentStep === 'checkout' && (
                                    <button onClick={() => setCurrentStep('cart')} className="text-gray-600 hover:text-foreground">
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <h2 className="text-2xl font-bold text-foreground">
                                    {currentStep === 'cart' ? 'Tu Carrito' : 'Checkout'}
                                </h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {currentStep === 'cart' ? (
                                items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                        <ShoppingCart size={64} className="opacity-20" />
                                        <p className="text-lg font-medium">Tu carrito está vacío</p>
                                        <button
                                            onClick={() => { setIsOpen(false); router.push('/products'); }}
                                            className="text-primary hover:underline"
                                        >
                                            Ver Productos
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((item, index) => (
                                            <motion.div
                                                layout
                                                key={`${item.id}-${index}`}
                                                className="bg-gray-50 rounded-xl p-4 flex gap-4"
                                            >
                                                <div className="relative w-20 h-20 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                                    {item.image && (
                                                        <Image
                                                            src={typeof item.image === 'string' ? item.image : urlFor(item.image).width(100).height(100).url()}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-foreground font-bold text-sm truncate">{item.name}</h3>
                                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                        <div className="text-gray-600 text-xs mt-1">
                                                            {Object.entries(item.selectedOptions).map(([optionName, values]) => (
                                                                <div key={optionName}>{optionName}: {values.join(', ')}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-primary font-bold text-sm mt-1">L. {item.price.toFixed(2)}</p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center bg-white rounded-full border border-gray-200">
                                                            <button
                                                                onClick={() => updateQuantity(item.id || '', item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-foreground"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-foreground font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id || '', item.quantity + 1)}
                                                                disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                                                                className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:text-foreground ${item.maxStock && item.quantity >= item.maxStock ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id || '')}
                                                            className="ml-auto text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre Completo *</label>
                                        <input
                                            className={`w-full border rounded-lg p-3 ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                            value={customer?.name || ''}
                                            onChange={(e) => onCustomerChange('name', e.target.value)}
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Teléfono *</label>
                                        <input
                                            className={`w-full border rounded-lg p-3 ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                            value={customer?.phone || ''}
                                            onChange={(e) => onCustomerChange('phone', e.target.value)}
                                        />
                                        {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                                    </div>

                                    {/* State Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Departamento *</label>
                                        <select
                                            className={`w-full border rounded-lg p-3 ${formErrors.state ? 'border-red-500' : 'border-gray-200'}`}
                                            value={customer?.state || ''}
                                            onChange={(e) => onCustomerChange('state', e.target.value)}
                                        >
                                            <option value="">Seleccione el departamento</option>
                                            {hondurasStates.map((state) => (
                                                <option key={state.name} value={state.name}>{state.name}</option>
                                            ))}
                                        </select>
                                        {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                                    </div>

                                    {/* City Selection */}
                                    {customer?.state && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ciudad *</label>
                                            <select
                                                className={`w-full border rounded-lg p-3 ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                value={customer?.city || ''}
                                                onChange={(e) => onCustomerChange('city', e.target.value)}
                                            >
                                                <option value="">Seleccione la ciudad</option>
                                                {availableCities.map((city) => (
                                                    <option key={city.name} value={city.name}>{city.name}</option>
                                                ))}
                                            </select>
                                            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                        </div>
                                    )}

                                    {/* Address - only editable with location button for La Ceiba */}
                                    {customer?.city && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Dirección *</label>
                                            <input
                                                className={`w-full border rounded-lg p-3 ${formErrors.address ? 'border-red-500' : 'border-gray-200'} ${isLaCeibaSelected && customer?.deliveryCoords ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                value={customer?.address || ''}
                                                onChange={(e) => !isLaCeibaSelected || !customer?.deliveryCoords ? onCustomerChange('address', e.target.value) : null}
                                                placeholder={isLaCeibaSelected ? "Use el botón 'Usar Mi Ubicación'" : "Ingrese su dirección completa"}
                                                readOnly={isLaCeibaSelected && !!customer?.deliveryCoords}
                                            />
                                            {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}

                                            {/* Show location button only for La Ceiba */}
                                            {isLaCeibaSelected && (
                                                <div className="mt-3">
                                                    <LocationPicker
                                                        onLocationSelect={(address, coords) => {
                                                            if (setCustomer) {
                                                                setCustomer({
                                                                    ...(customer || {}),
                                                                    address,
                                                                    deliveryCoords: coords,
                                                                });
                                                                // Clear address validation error when location is set
                                                                setFormErrors((prev: any) => ({ ...prev, address: undefined }));

                                                                // Calculate and set delivery price
                                                                const price = calculateDeliveryPrice(coords.lat, coords.lng);
                                                                setDeliveryPrice(price);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {isLaCeibaSelected && deliveryPrice === 0 && (
                                                <p className="text-green-600 text-xs mt-1 font-bold">¡Envío Gratis en zona céntrica!</p>
                                            )}
                                            {deliveryPrice > 0 && (
                                                <p className="text-gray-600 text-xs mt-1">Costo de envío: {formatPrice(deliveryPrice)}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-3">Método de Pago *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onCustomerChange('paymentMethod', 'cash')}
                                                className={`p-3 rounded-lg border-2 transition-all ${customer?.paymentMethod === 'cash' ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary/50'}`}
                                            >
                                                Efectivo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onCustomerChange('paymentMethod', 'transfer')}
                                                className={`p-3 rounded-lg border-2 transition-all ${customer?.paymentMethod === 'transfer' ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary/50'}`}
                                            >
                                                Transferencia
                                            </button>
                                        </div>
                                        {formErrors.paymentMethod && <p className="text-red-500 text-xs mt-2">{formErrors.paymentMethod}</p>}
                                    </div>

                                    {/* Transfer details */}
                                    {customer?.paymentMethod === 'transfer' && settings?.paymentMethods?.banks && (
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-600">Seleccione el banco</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {settings.paymentMethods.banks.map((bank: any) => (
                                                    <button
                                                        key={bank.bankName}
                                                        type="button"
                                                        onClick={() => onCustomerChange('selectedBank', bank.bankName)}
                                                        className={`p-2 rounded-lg border text-sm ${customer?.selectedBank === bank.bankName ? 'bg-secondary text-white border-secondary' : 'border-gray-200 hover:border-secondary/50'}`}
                                                    >
                                                        {bank.bankName}
                                                    </button>
                                                ))}
                                            </div>

                                            {customer?.selectedBank && (
                                                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg text-sm">
                                                    {(() => {
                                                        const bank = settings.paymentMethods.banks.find((b: any) => b.bankName === customer.selectedBank);
                                                        return bank && (
                                                            <>
                                                                <p className="font-bold mb-2">Datos de {bank.bankName}:</p>

                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className="flex-1">Cuenta: <span className="font-mono font-bold">{bank.accountNumber}</span></p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(bank.accountNumber);
                                                                            setCopiedAccount(bank.bankName);
                                                                            setTimeout(() => setCopiedAccount(null), 2000);
                                                                        }}
                                                                        className={`text-xs px-2 py-1 rounded transition-colors ${copiedAccount === bank.bankName ? 'bg-green-600 text-white' : 'bg-secondary hover:bg-secondary/80 text-white'}`}
                                                                    >
                                                                        {copiedAccount === bank.bankName ? '¡Copiado!' : 'Copiar'}
                                                                    </button>
                                                                </div>

                                                                <p>Titular: {bank.accountHolder}</p>
                                                                {bank.accountId && <p className="text-xs text-gray-600">ID: {bank.accountId}</p>}

                                                                <div className="mt-4 border-t border-secondary/20 pt-4">
                                                                    <label className="block text-xs font-bold mb-2 uppercase">Comprobante *</label>
                                                                    <input
                                                                        ref={fileInputRef}
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={async (e) => {
                                                                            if (e.target.files && e.target.files[0]) {
                                                                                const file = e.target.files[0];
                                                                                setTransferImage(file);
                                                                                setFormErrors((prev: any) => ({ ...prev, transferImage: undefined }));
                                                                                setUploadError(null);
                                                                                setUploadedImageUrl('');

                                                                                setIsUploading(true);
                                                                                try {
                                                                                    const compressedImage = await compressImage(file);
                                                                                    const timestamp = Date.now();
                                                                                    const uniqueName = `${timestamp}-${compressedImage.name}`;
                                                                                    const blob = await upload(uniqueName, compressedImage, {
                                                                                        access: 'public',
                                                                                        handleUploadUrl: '/api/upload',
                                                                                    });
                                                                                    setUploadedImageUrl(blob.url);
                                                                                } catch (error) {
                                                                                    setUploadError(`Error: ${(error as Error).message}`);
                                                                                    setTransferImage(null);
                                                                                }
                                                                                setIsUploading(false);
                                                                            }
                                                                        }}
                                                                        className="hidden"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => fileInputRef.current?.click()}
                                                                        disabled={isUploading}
                                                                        className={`w-full p-3 rounded-lg border border-dashed flex items-center justify-center gap-2 ${isUploading ? 'bg-gray-200 cursor-wait' : uploadedImageUrl ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 hover:border-secondary'}`}
                                                                    >
                                                                        {isUploading ? 'Subiendo...' : uploadedImageUrl ? '✓ Subido' : '+ Subir Comprobante'}
                                                                    </button>
                                                                    {formErrors.transferImage && <p className="text-red-500 text-xs mt-1">{formErrors.transferImage}</p>}
                                                                    {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Notas (Opcional)</label>
                                        <textarea
                                            className="w-full border border-gray-200 rounded-lg p-3 min-h-[80px]"
                                            placeholder="Instrucciones especiales"
                                            value={customer?.notes || ''}
                                            onChange={(e) => onCustomerChange('notes', e.target.value)}
                                        />
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-200 space-y-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>L. {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Envío</span>
                                    <span>L. {deliveryPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t pt-4">
                                    <span>Total</span>
                                    <span className="text-primary">L. {(totalPrice + deliveryPrice).toFixed(2)}</span>
                                </div>

                                {currentStep === 'cart' ? (
                                    <button
                                        onClick={() => setCurrentStep('checkout')}
                                        className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-xl transition-all"
                                    >
                                        Continuar
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={isUploading}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send size={20} />
                                        Enviar Pedido por WhatsApp
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
