import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/Basket";

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

export function StoreContextProvider({ children }: PropsWithChildren<any>) {
  const [basket, setBasket] = useState<Basket | null>(null);
  console.log('renderedagain');
  console.log(basket);
  
  const removeItem = (productId: number, quantity: number) => {
    
    if (!basket) return;

    const items = [...basket.items];
    const itemIndex = items.findIndex((item) => item.productId === productId);

    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;

      if (items[itemIndex].quantity <= 0) {
        items.splice(itemIndex, 1);
      }

      setBasket((prev) => {
        return { ...prev!, items };
      });
    }
  };

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("Oops - we do not seem to be inside the provider");
  }

  return context;
}