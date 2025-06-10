'use client'
import PublicNavigation from "./navigation/page";

export default function LayoutBeforeLogin({ children }) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navigation stays fixed */}
        <PublicNavigation />
        {/* Main content */}
        <main className="flex-grow">{children}</main> {/* Adjust padding here if necessary */}
      </div>
    );
}
