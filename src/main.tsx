
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Using your actual Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_aW5ub2NlbnQtdG9hZC01MC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#dc2626", // Red color for SECRECY brand
          colorBackground: "#111827", // Dark background
          colorInputBackground: "#1f2937",
          colorInputText: "#f9fafb",
          colorText: "#f9fafb",
          colorTextSecondary: "#9ca3af",
          colorNeutral: "#374151",
          borderRadius: "0.375rem",
          fontFamily: "'Inter', sans-serif"
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c"
            }
          },
          card: {
            backgroundColor: "#111827",
            border: "1px solid #374151",
            boxShadow: "0 0 15px rgba(220, 38, 38, 0.1)"
          },
          headerTitle: {
            color: "#f9fafb",
            fontWeight: "bold",
            fontSize: "1.5rem"
          },
          headerSubtitle: {
            color: "#9ca3af"
          },
          socialButtonsBlockButton: {
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#f9fafb",
            "&:hover": {
              backgroundColor: "#374151"
            }
          },
          formFieldInput: {
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#f9fafb",
            "&:focus": {
              borderColor: "#dc2626",
              boxShadow: "0 0 0 1px #dc2626"
            }
          },
          footerActionLink: {
            color: "#dc2626",
            "&:hover": {
              color: "#b91c1c"
            }
          }
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
