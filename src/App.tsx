import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DiscoveryPage from "./features/discovery/DiscoveryPage";

const ListingDetail = lazy(() => import("./features/listing/ListingDetail"));

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-white text-sm text-muted">
      Loading stay...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/rooms/:id" element={<ListingDetail />} />
          <Route path="/rooms/:id/photos" element={<ListingDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
