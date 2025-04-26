
import { AuthProvider } from "./context/AuthContext";
import AuthDirect from "./context/AuthDirect";

import LoginPage from "./components/authentication/login/page";

export default function Home() {
  return (
     <AuthProvider>
      <AuthDirect />
     </AuthProvider>
  );
}
