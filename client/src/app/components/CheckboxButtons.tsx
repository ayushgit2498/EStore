import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: any[];
  checked?: string[];
  onChange: (items: string[]) => void;
}

const CheckboxButtons = ({ items, checked, onChange }: Props) => {
  
    const [checkedItems, setCheckedItems] = useState(checked || []);

  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[];
    if (currentIndex === -1) {
      newChecked = [...checkedItems, value];
    } else {
      newChecked = checkedItems.filter((item) => item !== value);
    }
    setCheckedItems(newChecked);
    onChange(newChecked);
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={<Checkbox checked={checkedItems.indexOf(item) !== -1} />}
          onClick={() => handleChecked(item)}
          label={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxButtons;
