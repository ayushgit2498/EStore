import {
  Typography,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
} from "@mui/material";
import { BasketItem } from "../../app/models/Basket";
import { Order } from "../../app/models/Order";
import { currencyFormat } from "../../app/util/util";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";

interface Props {
  order: Order;
  setSelectedOrder: (orderNumber: number) => void;
}

export default function OrderDetailed({ order, setSelectedOrder }: Props) {
  const subtotal =
    order.orderItems.reduce(
      (amount, item) => amount + item.quantity * item.price,
      0
    ) ?? 0;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {order.id} - {order.orderStatus}
        </Typography>
        <Button
          onClick={() => setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </>
  );
}
