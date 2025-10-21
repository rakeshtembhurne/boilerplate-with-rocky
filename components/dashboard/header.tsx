interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="mb-4 flex flex-row items-center justify-between">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{heading}</h1>
      {children}
    </div>
  );
}
