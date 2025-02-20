import { useState, useEffect } from "react";
import "./App.css";
import { DiscSearch } from "./components/DiscSearch";
import { DiscCollection } from "./components/DiscCollection";
import { DiscBag } from "./components/DiscBag";
import { TabView } from "./components/TabView";
import { UserDisc } from "./types/disc";
import { userDiscService } from "./services/userDiscService";

function App() {
  const [collection, setCollection] = useState<UserDisc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const MAX_BAG_SIZE = 20;

  // Load collection on component mount
  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const userCollection = await userDiscService.getUserCollection();
      setCollection(userCollection);
      setError(null);
    } catch (err) {
      setError("Failed to load collection. Please try again later.");
      console.error("Error loading collection:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisc = async (disc: UserDisc) => {
    try {
      const addedDisc = await userDiscService.addDisc(disc);
      setCollection((prev) => [...prev, addedDisc]);
    } catch (err) {
      console.error("Error adding disc:", err);
      alert("Failed to add disc. Please try again.");
    }
  };

  const handleUpdateDisc = async (updatedDisc: UserDisc) => {
    try {
      const savedDisc = await userDiscService.updateDisc(updatedDisc);
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
      await userDiscService.removeDisc(discId);
      setCollection((prev) => prev.filter((disc) => disc.id !== discId));
    } catch (err) {
      console.error("Error removing disc:", err);
      alert("Failed to remove disc. Please try again.");
    }
  };

  const handleToggleInBag = async (discId: string) => {
    const disc = collection.find((d) => d.id === discId);
    if (!disc) return;

    const baggedDiscs = collection.filter((d) => d.inBag).length;

    // If trying to add to bag but it's full
    if (!disc.inBag && baggedDiscs >= MAX_BAG_SIZE) {
      alert("Your bag is full! Remove some discs first.");
      return;
    }

    try {
      const updatedDisc = await userDiscService.toggleDiscInBag(
        discId,
        !disc.inBag
      );
      setCollection((prev) =>
        prev.map((d) => (d.id === updatedDisc.id ? updatedDisc : d))
      );
    } catch (err) {
      console.error("Error toggling disc bag status:", err);
      alert("Failed to update disc bag status. Please try again.");
    }
  };

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
    <div className="app">
      <header>
        <h1>Disc Golf Bag Manager</h1>
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
  );
}

export default App;
