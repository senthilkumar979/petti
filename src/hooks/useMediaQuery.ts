import { useEffect, useState } from "react";
import { createMediaQuery } from "../utils/createMediaQuery";

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMobile(createMediaQuery("(max-width: 768px)"));
    setIsTablet(createMediaQuery("(max-width: 1024px)"));
    setIsDesktop(createMediaQuery("(max-width: 1280px)"));
  }, []);

  return { isMobile, isTablet, isDesktop };
};
