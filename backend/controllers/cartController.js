import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.id;

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        
        if (!cart) {
            return res.json({ success: true, cart: [] });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity = 1 } = req.body;
        const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

        // check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // if cart doesn't exist, create a new one
            cart = new Cart({
                userId,
                items: [{ productId, quantity: safeQuantity, price: product.productPrice }],
                totalPrice: product.productPrice * safeQuantity
            });
        } else {
            // cleanup any orphaned items (product deleted)
            cart.items = cart.items.filter(item => item.productId);
            // if cart exists, check if product is already in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId && item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                // if product exists just increase quantity
                cart.items[itemIndex].quantity += safeQuantity;
            } else {
                // if new product push to cart items array
                cart.items.push({
                    productId,
                    quantity: safeQuantity,
                    price: product.productPrice
                });
            }
        }

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId);
        const item = cart.items.find(item => item.productId && item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (type === "increase") {
            item.quantity += 1;
        } else if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();
        cart = await cart.populate("items.productId");

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.productId && item.productId.toString() !== productId);

        // Recalculate the total price after removal
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        cart = await cart.populate("items.productId")

        await cart.save();

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
