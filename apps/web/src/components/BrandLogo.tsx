import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-[126px] sm:w-[138px]",
  md: "w-[138px] sm:w-[152px]",
  lg: "w-[220px] sm:w-[260px]",
} as const;

export function BrandLogo({
  href = "/",
  size = "md",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="IviXHub — գլխավոր էջ"
      className="inline-flex shrink-0 items-center rounded-xl outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#12b8c4]/15"
    >
      <Image
        src="/brand/ivixhub-header.png"
        alt="IviXHub"
        width={1170}
        height={405}
        priority
        className={`${sizeClasses[size]} block h-auto object-contain`}
      />
    </Link>
  );
}
