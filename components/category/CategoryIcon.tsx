import { DynamicIcon } from "lucide-react/dynamic";
import { CategoryIconModal } from "@/types/categories";

const CategoryIcon = ({
  categoryIcon,
  className,
  size,
}: {
  categoryIcon?: CategoryIconModal;
  className?: string;
  size?: number;
}) => {
  if (!categoryIcon || !categoryIcon.icon) {
    return null;
  }

  return (
    <DynamicIcon
      name={categoryIcon.icon as never}
      color={categoryIcon.color}
      size={size ?? 16}
      className={className}
    />
  );
};

export default CategoryIcon;
