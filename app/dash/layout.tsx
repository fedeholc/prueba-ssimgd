import { ContextProvider } from "../context";

export default function DashLayout ( {children}: Readonly<{children: React.ReactNode}> ) {

  return (
    <div>
      <ContextProvider>
      <h1>Dashboard Layout</h1>
      {children}
      </ContextProvider>
    </div>
  )
}