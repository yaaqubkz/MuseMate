import React, { useEffect, useState } from "react";
import RhymeDropdown from "./RhymeDropdown"; // Import the RhymeDropdown component
import PlagiarismCheckButton from "./PlaigarismCheckButton";

interface Section {
  id: number;
  chords: string;
  lyrics: string;
}

const DynamicTextBoxes: React.FC = ({
  initialChords,
  initialLyrics,
  onSave,
}) => {
  useEffect(() => {
    const chordSections = initialChords.split("\n");
    const lyricSections = initialLyrics.split("\n");
    const initialSections = chordSections.map((chord, index) => ({
      id: Date.now() + index,
      chords: chord || "",
      lyrics: lyricSections[index] || "",
    }));
    setSections(initialSections);
  }, [initialChords, initialLyrics]);

  const [sections, setSections] = useState<Section[]>([
    { id: Date.now(), chords: "", lyrics: "" },
  ]);

  const [textToCheck, setTextToCheck] = useState<string>(""); // Store the combined text to check

  // Function to extract the last word from lyrics
  const getLastWord = (lyrics: string): string => {
    const words = lyrics.trim().split(/\s+/); // Split lyrics into words and remove extra spaces
    return words.length > 0 ? words[words.length - 1] : ""; // Return the last word, or an empty string if no words exist
  };

  const handlePlagiarismCheck = async () => {
    // Collect all the lyrics from all sections
    const text = sections.map((section) => section.lyrics).join("\n");
    setTextToCheck(text); // Update the textToCheck state
  };

  const handleSave = () => {
    const combinedChords = sections.map((section) => section.chords).join("\n");
    const combinedLyrics = sections.map((section) => section.lyrics).join("\n");
    onSave(combinedChords, combinedLyrics);
  };

  // Function to handle input changes
  const handleInputChange = (sectionId, type, event) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, [type]: event.target.value }
        : section
    );
    setSections(updatedSections);
  };

  // Function to add a new section (chords + lyrics)
  const addNewSection = () => {
    const newSection: Section = { id: Date.now(), chords: "", lyrics: "" };
    setSections([...sections, newSection]);
  };

  // Function to remove the last section
  const removeLastSection = () => {
    if (sections.length > 1) {
      setSections(sections.slice(0, -1)); // Remove the last section
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Render text boxes dynamically */}
      {sections.map((section) => {
        const lastWord = getLastWord(section.lyrics); // Get the last word from the lyrics input
        return (
          <div
            key={section.id}
            style={{
              marginBottom: "30px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "20px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              {/* Chords Text Box */}
              <input
                type="text"
                value={section.chords}
                onChange={(event) =>
                  handleInputChange(section.id, "chords", event)
                }
                placeholder="Enter Chords"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Lyrics Text Box */}
              <input
                type="text"
                value={section.lyrics}
                onChange={(event) =>
                  handleInputChange(section.id, "lyrics", event)
                }
                placeholder="Enter Lyrics"
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  outline: "none",
                  marginRight: "10px", // Space between lyrics and dropdown
                }}
              />
              {/* RhymeDropdown */}
              <RhymeDropdown word={lastWord} />
            </div>
          </div>
        );
      })}

      {/* Add and Remove Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={addNewSection}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "24px",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Add Section"
        >
          +
        </button>

        <button
          onClick={removeLastSection}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#f44336",
            color: "white",
            fontSize: "24px",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          title="Remove Section"
        >
          −
        </button>
      </div>

      {/* Plagiarism Check Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <PlagiarismCheckButton textToCheck={initialLyrics} />
      </div>
      <button
        onClick={handleSave}
        style={{
          marginBottom: "-10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Chords and Lyrics!
      </button>
    </div>
  );
};

export default DynamicTextBoxes;
