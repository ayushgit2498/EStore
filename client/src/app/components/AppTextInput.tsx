import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
}

const AppTextInput = (props: Props) => {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  return (
    <TextField
      {...props}
      {...field}
      variant="outlined"
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

export default AppTextInput;
