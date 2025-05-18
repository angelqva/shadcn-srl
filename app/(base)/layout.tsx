import { Navbar } from "./_components/navbar";

export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-svh">
      <Navbar />
      <main className="px-6 pt-16 ">
        {children}
      </main>
    </div>

  );
}
