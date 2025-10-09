import Link from "next/link";

export const HeaderLink = ({
  label,
  href,
  icon,
  onClick,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  const isActive = window.location.pathname === href;
  return (
    <Link
      className={`flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-black font-medium transition-colors cursor-pointer hover:rounded-none rounded-md p-2 ${
        isActive
          ? "bg-black text-white hover:bg-white hover:text-black hover:rounded-md hover:border border-black"
          : ""
      }`}
      href={href}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  );
};
