import React, { useState } from "react";
import { UserDisc } from "../types/disc";
import { Modal } from "./Modal";

interface DiscBagProps {
  discs: UserDisc[];
  maxDiscs: number;
  onRemoveFromBag: (discId: string) => void;
}

export const DiscBag: React.FC<DiscBagProps> = ({
  discs,
  maxDiscs,
  onRemoveFromBag,
}) => {
  const [selectedDisc, setSelectedDisc] = useState<UserDisc | null>(null);
  const baggedDiscs = discs.filter((disc) => disc.inBag);
  const availableSlots = maxDiscs - baggedDiscs.length;

  // Group discs by category
  const groupedDiscs = baggedDiscs.reduce((acc, disc) => {
    if (!acc[disc.category]) {
      acc[disc.category] = [];
    }
    acc[disc.category].push(disc);
    return acc;
  }, {} as Record<string, UserDisc[]>);

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
    <div className="disc-bag">
      <h2>My Bag</h2>
      <p>
        Available slots: {availableSlots} of {maxDiscs}
      </p>

      {Object.entries(groupedDiscs).map(([category, discs]) => (
        <div key={category} className="category-section">
          <h3>{category}</h3>
          <div className="disc-list">
            {discs.map((disc) => (
              <div
                key={disc.discId}
                className="disc-list-item"
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
                      onRemoveFromBag(disc.discId);
                    }}
                    className="remove-from-bag"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {availableSlots === maxDiscs && (
        <p className="empty-bag-message">
          Your bag is empty. Add some discs from your collection!
        </p>
      )}

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
              <div className="disc-specs">
                <div>Weight: {selectedDisc.weight}g</div>
                <div>Condition: {selectedDisc.condition}</div>
                {selectedDisc.notes && (
                  <div className="notes">Notes: {selectedDisc.notes}</div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  onRemoveFromBag(selectedDisc.discId);
                  handleCloseModal();
                }}
                className="remove-from-bag"
              >
                Remove from Bag
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
