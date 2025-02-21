import React, { useState } from "react";
import { UserDisc } from "../types/disc";
import { Modal } from "./Modal";

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
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleCloseModal = () => {
    setSelectedDisc(null);
  };

  const handleItemClick = (disc: UserDisc, e: React.MouseEvent) => {
    // Don't open modal if clicking action buttons
    if ((e.target as HTMLElement).closest(".disc-actions")) {
      return;
    }
    setSelectedDisc(disc);
  };

  return (
    <div className="disc-collection">
      <h2>My Collection</h2>
      <div className="disc-list">
        {discs.map((disc) => (
          <div
            key={disc.id}
            className={`disc-list-item ${disc.inBag ? "in-bag" : ""}`}
            onClick={(e) => handleItemClick(disc, e)}
          >
            <div className="disc-list-info">
              <span className="disc-name">{disc.name}</span>
              <span className="manufacturer">({disc.manufacturer})</span>
              <span className="flight-numbers">
                {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
              </span>
            </div>
            <div className="disc-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleInBag(disc.id);
                }}
                className={disc.inBag ? "remove-from-bag" : "add-to-bag"}
              >
                {disc.inBag ? "Remove from Bag" : "Add to Bag"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedDisc !== null}
        onClose={handleCloseModal}
        title={selectedDisc ? `${selectedDisc.name} Details` : ""}
      >
        {selectedDisc && (
          <div className="disc-details-modal">
            {selectedDisc.image && (
              <img src={selectedDisc.image} alt={selectedDisc.name} />
            )}
            <div className="disc-info-section">
              <h3>{selectedDisc.manufacturer}</h3>
              <div className="flight-numbers-detail">
                <div>Speed: {selectedDisc.speed}</div>
                <div>Glide: {selectedDisc.glide}</div>
                <div>Turn: {selectedDisc.turn}</div>
                <div>Fade: {selectedDisc.fade}</div>
              </div>
            </div>
            <div className="disc-edit-section">
              <select
                value={selectedDisc.condition}
                onChange={(e) =>
                  onUpdateDisc({ ...selectedDisc, condition: e.target.value })
                }
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              <div className="weight-input">
                <input
                  type="number"
                  value={selectedDisc.weight}
                  onChange={(e) =>
                    onUpdateDisc({
                      ...selectedDisc,
                      weight: Number(e.target.value),
                    })
                  }
                  min="100"
                  max="200"
                />
                <span>g</span>
              </div>
              <textarea
                value={selectedDisc.notes || ""}
                onChange={(e) =>
                  onUpdateDisc({ ...selectedDisc, notes: e.target.value })
                }
                placeholder="Add notes..."
              />
              <div className="modal-actions">
                <button
                  onClick={() => onToggleInBag(selectedDisc.id)}
                  className={
                    selectedDisc.inBag ? "remove-from-bag" : "add-to-bag"
                  }
                >
                  {selectedDisc.inBag ? "Remove from Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={() => {
                    onRemoveDisc(selectedDisc.id);
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
