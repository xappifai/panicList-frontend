import React from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";

export default function ProviderSettings() {
  return (
    <ProviderAuthGuard>
      <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Settings</h2>
        <p style={{ margin: 0, color: "#6B7280" }}>
          Update your profile, preferences, and security settings.
        </p>
      </div>
    </ProviderAuthGuard>
  );
}


