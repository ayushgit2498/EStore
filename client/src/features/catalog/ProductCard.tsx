import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import { Product } from "../../app/models/Product";
import { addBasketItemAsync } from "../../app/store/basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {product.name.charAt(0)}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <CardMedia
        image={product.pictureUrl}
        title={product.name}
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          // We do this because now all product card components
          // are sharing the central state status and not their individual loading state as before
          loading={status === `pendingAddItem${product.id}`}
          onClick={() =>
            dispatch(addBasketItemAsync({ productId: product.id }))
          }
          size="small"
        >
          Add to Cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
