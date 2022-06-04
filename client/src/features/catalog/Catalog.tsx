import { Grid, Paper } from "@mui/material";
import { Fragment, useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
  fetchFilters,
  fetchProductsAsync,
  productSelectors,
  setPageNumber,
  setProductParams,
} from "../../app/store/catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
];

const Catalog = () => {
  const products = useAppSelector(productSelectors.selectAll);
  const {
    productsLoaded,
    status,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch]);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  if (!filtersLoaded)
    return <LoadingComponent message="Loading Products ..." />;
  // if (loading) return <LoadingComponent message='Loading products...' />

  return (
    <Fragment>
      <Grid container columnSpacing={2}>
        <Grid item xs={3}>
          <ProductSearch />
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
              options={sortOptions}
              selectedValue={productParams.orderByArgument}
              onChange={(event) =>
                dispatch(
                  setProductParams({ orderByArgument: event.target.value })
                )
              }
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              items={brands}
              checked={productParams.brands}
              onChange={(items: string[]) => {
                dispatch(setProductParams({ brands: items }));
              }}
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              items={types}
              checked={productParams.types}
              onChange={(items: string[]) => {
                dispatch(setProductParams({ types: items }));
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProductList products={products} />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9} sx={{ mb: 2 }}>
          {metaData && (
            <AppPagination
              metaData={metaData}
              onPageChange={(page) => {
                dispatch(setProductParams({ pageNumber: page }));
              }}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Catalog;
