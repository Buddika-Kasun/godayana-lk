import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNavProvider } from "@/context/MobileNavContext";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
      <MobileNavProvider
      //className="w-full overflow-x-hidden"
      >
        <Header />
        <main
        //className="min-h-screen w-full overflow-x-hidden px-0"
        >
          {children}
        </main>
        <Footer />
      </MobileNavProvider>
    );
}