import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../api/agent";
import { MetaData } from "../models/Pagination";
import { Product, ProductParams } from "../models/Product";
import { RootState } from "./configureStore";

interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams();

  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderByArgument", productParams.orderByArgument);
  if (productParams.searchTerm) {
    params.append("searchTerm", productParams.searchTerm);
  }
  if (productParams.brands.length > 0) {
    params.append("brands", productParams.brands.toString());
  }
  if (productParams.types.length > 0) {
    params.append("types", productParams.types.toString());
  }

  return params;
}

export const fetchProductsAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProductsAsync", async (_, thunkAPI) => {
  try {
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
    const response = await agent.Catalog.list(params);
    thunkAPI.dispatch(setMetadata(response.metaData));
    return response.items;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFilters = createAsyncThunk(
  "catalog/fetchFilters",
  async (productId, thunkAPI) => {
    try {
      return agent.Catalog.fetchFilters();
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams() {
  return {
    orderByArgument: "name",
    brands: [],
    types: [],
    pageNumber: 1,
    pageSize: 6,
  };
}

const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",
    brands: [],
    types: [],
    productParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setProductParams(state, action) {
      state.productsLoaded = false;
      const payload = action.payload;
      if (payload.pageNumber) {
        state.productParams = { ...state.productParams, ...action.payload };
      }
      else {
        state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 };
      }
    },
    resetProductParams(state) {
      state.productParams = initParams();
    },
    setMetadata(state, action) {
      state.metaData = action.payload;
    },
    setPageNumber(state, action) {
      state.productParams.pageNumber = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      console.log(action.payload);
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      console.log(action.payload);
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      console.log(action.payload);
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.filtersLoaded = true;
      state.status = "idle";
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export default catalogSlice.reducer;
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
export const { setProductParams, resetProductParams, setMetadata, setPageNumber } =
  catalogSlice.actions;
