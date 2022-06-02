import { Fragment, useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  fetchProductsAsync,
  productSelectors,
} from "../../app/store/catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";

const Catalog = () => {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  if (status.includes("pending"))
    return <LoadingComponent message="Loading Products ..." />;
  // if (loading) return <LoadingComponent message='Loading products...' />

  return (
    <Fragment>
      <ProductList products={products} />
    </Fragment>
  );
};

export default Catalog;
