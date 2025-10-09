import {
  CreditCardIcon,
  FileIcon,
  FileTextIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import { HeaderLink } from "./HeaderLink";

export const HeaderMenu = ({
  closeMobileMenu,
}: {
  closeMobileMenu: () => void;
}) => {
  return (
    <>
      <HeaderLink
        label="Home"
        href="/"
        onClick={closeMobileMenu}
        icon={<HomeIcon className="w-4 h-4" />}
      />
      <HeaderLink
        label="Subscriptions"
        href="/subscriptions"
        onClick={closeMobileMenu}
        icon={<CreditCardIcon className="w-4 h-4" />}
      />
      <HeaderLink
        label="Documents"
        href="/documents"
        onClick={closeMobileMenu}
        icon={<FileIcon className="w-4 h-4" />}
      />
      <HeaderLink
        label="Contacts"
        href="/contacts"
        onClick={closeMobileMenu}
        icon={<UsersIcon className="w-4 h-4" />}
      />
      <HeaderLink
        label="Notes"
        href="/notes"
        onClick={closeMobileMenu}
        icon={<FileTextIcon className="w-4 h-4" />}
      />
    </>
  );
};
