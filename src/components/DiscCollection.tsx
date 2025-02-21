import React, { useState, useEffect } from "react";
import { UserDisc, DEFAULT_COLORS } from "../types/disc";
import { Modal } from "./Modal";
import { useDebounce } from "../hooks/useDebounce";

interface DiscCollectionProps {
  discs: UserDisc[];
  onUpdateDisc: (disc: UserDisc) => void;
  onRemoveDisc: (discId: string) => void;
  onToggleInBag: (discId: string) => void;
}

export const DiscCollection: React.FC<DiscCollectionProps> = ({
  discs,
  onUpdateDisc,
  onRemoveDisc,
  onToggleInBag,
}) => {
  const [selectedDisc, setSelectedDisc] = useState<UserDisc | null>(null);
  const [localDisc, setLocalDisc] = useState<UserDisc | null>(null);
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  // Update localDisc when selectedDisc changes or when the disc in the collection updates
  useEffect(() => {
    if (selectedDisc) {
      const updatedDisc = discs.find((d) => d.discId === selectedDisc.discId);
      if (updatedDisc) {
        setLocalDisc(updatedDisc);
        setSelectedDisc(updatedDisc);
      }
    }
  }, [selectedDisc, discs]);

  const handleCloseModal = () => {
    setSelectedDisc(null);
    setLocalDisc(null);
  };

  const handleItemClick = (disc: UserDisc, e: React.MouseEvent) => {
    // Don't open modal if clicking action buttons
    if ((e.target as HTMLElement).closest(".disc-actions")) {
      return;
    }
    setSelectedDisc(disc);
    setLocalDisc(disc);
  };

  // Debounce the notes update
  const debouncedNotes = useDebounce(localDisc?.notes, 500);

  // Effect to handle debounced notes update
  useEffect(() => {
    if (
      localDisc &&
      debouncedNotes !== undefined &&
      debouncedNotes !== selectedDisc?.notes
    ) {
      onUpdateDisc(localDisc);
    }
  }, [debouncedNotes]);

  const handleDiscUpdate = (updates: Partial<UserDisc>) => {
    if (!localDisc) return;

    const updatedDisc = { ...localDisc, ...updates };
    setLocalDisc(updatedDisc);

    // For immediate updates (condition, weight, and color), update right away
    if ("condition" in updates || "weight" in updates || "color" in updates) {
      onUpdateDisc(updatedDisc);
    }
    // Notes updates are handled by the debounce effect
  };

  return (
    <div className="disc-collection">
      <h2>My Collection</h2>
      <div className="disc-list">
        {discs.map((disc) => (
          <div
            key={disc.discId}
            className={`disc-list-item ${disc.inBag ? "in-bag" : ""}`}
            onClick={(e) => handleItemClick(disc, e)}
          >
            <div
              className="disc-list-info"
              style={{
                display: "grid",
                gridTemplateColumns: "200px 30px 150px 150px 120px",
                gap: "16px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span className="disc-name">{disc.name}</span>

              <div
                style={{
                  backgroundColor: disc.color,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  flexShrink: 0,
                }}
              />

              <span className="manufacturer">{disc.manufacturer}</span>
              <div className="disc-list-details">
                {disc.weight}g • {disc.condition}
              </div>
              <span className="flight-numbers">
                {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
              </span>
            </div>
            <div className="disc-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleInBag(disc.discId);
                }}
                className={disc.inBag ? "remove-from-bag" : "add-to-bag"}
              >
                {disc.inBag ? "Shelf it" : "Bag it"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedDisc !== null && localDisc !== null}
        onClose={handleCloseModal}
        title={localDisc ? `${localDisc.name} Details` : ""}
      >
        {localDisc && (
          <div className="disc-details-modal">
            {localDisc.image && (
              <img src={localDisc.image} alt={localDisc.name} />
            )}
            <div className="disc-info-section">
              <h3>{localDisc.manufacturer}</h3>
              <div className="flight-numbers-detail">
                <div>Speed: {localDisc.speed}</div>
                <div>Glide: {localDisc.glide}</div>
                <div>Turn: {localDisc.turn}</div>
                <div>Fade: {localDisc.fade}</div>
              </div>
            </div>
            <div className="disc-edit-section">
              <div className="input-group">
                <label>Condition:</label>
                <select
                  value={localDisc.condition}
                  onChange={(e) =>
                    handleDiscUpdate({ condition: e.target.value })
                  }
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Color:</label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={localDisc.color}
                    onChange={(e) =>
                      handleDiscUpdate({ color: e.target.value })
                    }
                    className="color-picker"
                  />
                  <div className="default-colors">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        className="color-preset"
                        style={{ backgroundColor: color }}
                        onClick={() => handleDiscUpdate({ color })}
                        aria-label={`Set color to ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Weight:</label>
                <div className="weight-input">
                  <input
                    type="number"
                    value={localDisc.weight}
                    onChange={(e) =>
                      handleDiscUpdate({ weight: Number(e.target.value) })
                    }
                    min="100"
                    max="200"
                  />
                  <span>g</span>
                </div>
              </div>

              <div className="input-group">
                <label>Notes:</label>
                <textarea
                  value={localDisc.notes || ""}
                  onChange={(e) => handleDiscUpdate({ notes: e.target.value })}
                  placeholder="Add notes..."
                />
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => onToggleInBag(localDisc.discId)}
                  className={localDisc.inBag ? "remove-from-bag" : "add-to-bag"}
                >
                  {localDisc.inBag ? "Remove from Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={() => {
                    onRemoveDisc(localDisc.discId);
                    handleCloseModal();
                  }}
                  className="remove-disc"
                >
                  Remove from Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
