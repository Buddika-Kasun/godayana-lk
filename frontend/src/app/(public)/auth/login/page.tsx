// app/auth/login/page.tsx
import { Suspense } from "react";
import LoginClient from "../../../../components/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-10 pb-20 bg-primary/10 flex flex-col items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
