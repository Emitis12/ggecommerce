// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const productId = action.payload.product.id || action.payload.product._id;

      const existing = state.items.find(
        (i) => (i.product.id || i.product._id) === productId
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            (i.product.id || i.product._id) === productId
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            (i.product.id || i.product._id) !== action.payload.productId
        ),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          (i.product.id || i.product._id) === action.payload.productId
            ? { ...i, qty: action.payload.qty }
            : i
        ),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

export function useCartState() {
  const context = useContext(CartStateContext);
  if (!context) throw new Error("useCartState must be used within CartProvider");
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context)
    throw new Error("useCartDispatch must be used within CartProvider");
  return context;
}
