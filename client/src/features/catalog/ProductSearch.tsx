import { debounce, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { setProductParams } from "../../app/store/catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

export default function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
  const dispatch = useAppDispatch();

  const debouncedSearch = debounce((event: any) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  }, 1000);
  // You can say debounce is same as below code
  //    useEffect(() => {
  //     const timeOutId = setTimeout(() => setDisplayMessage(searchTerm), 500);
  //     return () => clearTimeout(timeOutId);
  //   }, [searchTerm]);

  const onChangeHandler = (event: any) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event);
  };

  return (
    <Paper sx={{ mb: 2 }}>
      <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={onChangeHandler}
      />
    </Paper>
  );
}
