import { Facebook, Github, Instagram } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

type DropdownSocialsProps = {
  items?: string[];
  icon?: string;
};

export default function DropdownSocials({ items, icon }: DropdownSocialsProps) {
  const [localItems, setLocalItems] = useState(items);

  const handleIconChange = (index: number, value: string) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], icon: value };
    updateItems(newItems);
  };
  return (
    <Select
      value={icon}
      onValueChange={(value) => handleIconChange(index, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Social" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="facebook">
          <Facebook />
          Facebook
        </SelectItem>
        <SelectItem value="instagram">
          <Instagram />
          Instagram
        </SelectItem>
        <SelectItem value="github">
          <Github />
          Github
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
