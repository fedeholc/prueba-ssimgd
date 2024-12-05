export default function DashLayout ( {children}: Readonly<{children: React.ReactNode}> ) {
  return (
    <div>
      <h1>Dashboard Layout</h1>
      <p>Dashboard layout content</p>
      {children}
    </div>
  )
}