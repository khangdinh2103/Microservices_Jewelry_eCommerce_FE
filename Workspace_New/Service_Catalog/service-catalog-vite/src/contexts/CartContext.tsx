import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import {cartService} from '../services/cartService';
import {useAuth} from './AuthContext'; // Giả định bạn có context để quản lý authentication

interface CartItem {
    cartItemID: number;
    productID: number;
    productName: string;
    quantity: number;
    price: number;
    imageURL: string | null;
}

interface CartContextType {
    cartItems: CartItem[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    error: string | null;
    addToCart: (productID: number, quantity: number) => Promise<void>;
    updateQuantity: (cartItemID: number, quantity: number) => Promise<void>;
    removeFromCart: (cartItemID: number) => Promise<void>;
    clearErrors: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {user, isAuthenticated} = useAuth();

    // Tính toán tổng số lượng và tổng giá trị
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Lấy giỏ hàng khi người dùng đã đăng nhập
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated, user]);

    // Hàm lấy giỏ hàng từ server
    const fetchCart = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
            const cart = await cartService.getCart(userId);
            setCartItems(cart.items);
        } catch (err) {
            setError('Không thể lấy thông tin giỏ hàng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (productID: number, quantity: number) => {
        if (!isAuthenticated || !user) {
            setError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Lấy cartID từ thông tin người dùng hoặc call API để lấy cartID
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
            const userCart = await cartService.getCart(userId);
            const cartID = userCart.cartId;

            await cartService.addToCart(cartID, productID, quantity);
            await fetchCart(); // Cập nhật lại giỏ hàng
        } catch (err: any) {
            setError(err.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số lượng
    const updateQuantity = async (cartItemID: number, quantity: number) => {
        setLoading(true);
        setError(null);

        try {
            await cartService.updateQuantity(cartItemID, quantity);
            await fetchCart();
        } catch (err: any) {
            setError(err.message || 'Không thể cập nhật số lượng sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    // Xóa khỏi giỏ hàng
    const removeFromCart = async (cartItemID: number) => {
        setLoading(true);
        setError(null);

        try {
            await cartService.removeItem(cartItemID);
            await fetchCart();
        } catch (err: any) {
            setError(err.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    // Xóa thông báo lỗi
    const clearErrors = () => setError(null);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                totalItems,
                totalPrice,
                loading,
                error,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearErrors,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
