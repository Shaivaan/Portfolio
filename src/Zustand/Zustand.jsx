import { create } from 'zustand';
const useZustandStore = create()((set) => ({
    portfolioData : {
        user : null,
        projects : [],
        workExp : []
    },
    setPortfolioData : (portfolioData)=>set((_state) => ({ portfolioData })),
}))

export {useZustandStore};