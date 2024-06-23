const useZustandStore = create()((set) => ({
    portfolioData : null,
    setPortfolioData : (portfolioData)=>set((_state) => ({ portfolioData })),
}))