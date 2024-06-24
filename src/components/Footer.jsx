import React from "react";
import "../styles/footer.css";
import { useZustandStore } from "../Zustand/Zustand";

export const Footer = () => {
  const portfolioData = useZustandStore((state) => state.portfolioData);
	const {user} = portfolioData;
  return <footer>{user?.first_name} Porfolio </footer>;
};
