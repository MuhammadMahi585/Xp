import Navigation from "../../navigation/page";

export default function CustomerLayout({ children }) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navigation stays fixed */}
        <Navigation />
        {/* Main content */}
        <main className="flex-grow pt-6">{children}</main> {/* Adjust padding here if necessary */}
      </div>
    );
}
