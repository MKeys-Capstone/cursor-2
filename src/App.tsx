import { useState } from "react";
import "./App.css";
import { DiscSearch } from "./components/DiscSearch";
import { DiscCollection } from "./components/DiscCollection";
import { DiscBag } from "./components/DiscBag";
import { TabView } from "./components/TabView";
import { UserDisc } from "./types/disc";

function App() {
  const [collection, setCollection] = useState<UserDisc[]>([]);
  const MAX_BAG_SIZE = 20;

  const handleAddDisc = (disc: UserDisc) => {
    setCollection((prev) => [...prev, disc]);
  };

  const handleUpdateDisc = (updatedDisc: UserDisc) => {
    setCollection((prev) =>
      prev.map((disc) => (disc.id === updatedDisc.id ? updatedDisc : disc))
    );
  };

  const handleRemoveDisc = (discId: string) => {
    setCollection((prev) => prev.filter((disc) => disc.id !== discId));
  };

  const handleToggleInBag = (discId: string) => {
    setCollection((prev) => {
      const baggedDiscs = prev.filter((d) => d.inBag).length;
      const disc = prev.find((d) => d.id === discId);

      if (!disc) return prev;

      // If trying to add to bag but it's full
      if (!disc.inBag && baggedDiscs >= MAX_BAG_SIZE) {
        alert("Your bag is full! Remove some discs first.");
        return prev;
      }

      return prev.map((d) => (d.id === discId ? { ...d, inBag: !d.inBag } : d));
    });
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
