import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "../../app/store/accountSlice";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

export default function Register() {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        }
      });
    }
  }

  async function submitForm(data: FieldValues) {
    await agent.Account.register(data)
      .then(() => {
        toast.success("Registration successful - you can now login");
        history.push("/login");
      })
      .catch((error) => handleApiErrors(error));
  }
  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          autoFocus
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors?.username?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\w+[\w-.]*@\w+((-\w+)|(\w*)).[a-z]{2,3}$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
              message: "Password is not complex enough",
            },
          })}
          error={!!errors.password}
          helperText={errors?.password?.message}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login">{"Already have an account? Sign In"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}