import { useEffect, useState } from "react";
import { createMediaQuery } from "../utils/createMediaQuery";

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMobile(createMediaQuery("(max-width: 768px)"));
    setIsTablet(createMediaQuery("(min-width: 769px) and (max-width: 1024px)"));
    setIsDesktop(createMediaQuery("(min-width: 1025px)"));
  }, []);

  return { isMobile, isTablet, isDesktop };
};
