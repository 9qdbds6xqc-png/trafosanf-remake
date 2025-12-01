import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  linkText: string;
  href?: string;
}

export const ProductCard = ({ imageUrl, title, linkText, href = "#" }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded-sm mb-4">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-muted-foreground mb-2">{title}</p>
      <a
        href={href}
        className="inline-flex items-center text-primary font-medium hover:underline"
      >
        {linkText}
        <ArrowRight className="ml-2 w-4 h-4" />
      </a>
    </div>
  );
};
