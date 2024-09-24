import React from 'react'
import { useSelector } from 'react-redux'

export default function ThemeProvider({children}) {
    const {theme} = useSelector(state => state.theme);
  return (
    <div className={`${theme} min-h-screen`}>
        <div className="bg-gray-50 text-black dark:text-white dark:bg-slate-900 min-h-screen">
            {children}
        </div>
</div>
  )
}