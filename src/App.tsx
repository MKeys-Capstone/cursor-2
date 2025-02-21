import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Login } from "./components/Login";
import { configureAuth } from "./auth/AuthConfig";
import "./App.css";
import { DiscSearch } from "./components/DiscSearch";
import { DiscCollection } from "./components/DiscCollection";
import { DiscBag } from "./components/DiscBag";
import { TabView } from "./components/TabView";
// import { UserDisc } from "./types/UserDisc";
import { useUserDiscService } from "./services/userDiscService";
import { UserDisc } from "./types/UserDisc";

const App: React.FC = () => {
  const [collection, setCollection] = useState<UserDisc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const MAX_BAG_SIZE = 20;

  const discService = useUserDiscService();

  useEffect(() => {
    configureAuth();
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const data = await discService.getCollection();
      setCollection(data);
      setError(null);
    } catch (err) {
      setError("Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisc = async (disc: UserDisc) => {
    try {
      const addedDisc = await discService.addDisc(disc);
      setCollection((prev) => [...prev, addedDisc]);
      setError(null);
    } catch (err) {
      setError("Failed to add disc");
    }
  };

  const handleUpdateDisc = async (updatedDisc: UserDisc) => {
    try {
      const savedDisc = await discService.updateDisc(updatedDisc);
      setCollection((prev) =>
        prev.map((disc) => (disc.id === savedDisc.id ? savedDisc : disc))
      );
    } catch (err) {
      console.error("Error updating disc:", err);
      alert("Failed to update disc. Please try again.");
    }
  };

  const handleRemoveDisc = async (discId: string) => {
    try {
      await discService.removeDisc(discId);
      setCollection((prev) => prev.filter((disc) => disc.id !== discId));
      setError(null);
    } catch (err) {
      setError("Failed to remove disc");
    }
  };

  const handleToggleInBag = async (discId: string) => {
    try {
      await discService.toggleInBag(discId);
      setCollection((prev) =>
        prev.map((disc) =>
          disc.id === discId ? { ...disc, inBag: !disc.inBag } : disc
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to update disc");
    }
  };

  const bagged = collection.filter((d) => d.inBag).length;
  const canAddToBag = bagged < MAX_BAG_SIZE;
  const available = collection.filter((d) => !d.inBag).length;

  const tabs = [
    {
      label: "Collection",
      content: (
        <DiscCollection
          discs={collection}
          onUpdateDisc={handleUpdateDisc}
          onRemoveDisc={handleRemoveDisc}
          onToggleInBag={handleToggleInBag}
        />
      ),
    },
    {
      label: "Bag",
      content: (
        <DiscBag
          discs={collection}
          maxDiscs={MAX_BAG_SIZE}
          onRemoveFromBag={handleToggleInBag}
        />
      ),
    },
  ];

  if (loading) {
    return <div className="loading">Loading your collection...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadCollection}>Try Again</button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="app">
                  <header>
                    <h1>Disc Golf Collection Manager</h1>
                    {error && <div className="error">{error}</div>}
                    <div className="stats">
                      <span>
                        In Bag: {bagged}/{MAX_BAG_SIZE}
                      </span>
                      <span>Available: {available}</span>
                    </div>
                  </header>
                  <main>
                    <div className="search-section">
                      <DiscSearch onAddDisc={handleAddDisc} />
                    </div>

                    <div className="content-section">
                      <TabView tabs={tabs} />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
