
export interface DharmaNameEntry {
  id: number;
  name: string; // Tibetan Script e.g., "རིག་འཛིན་འཚོ་གནམ།"
  phonetic: string; // Chinese Phonetic Transcription e.g., "仁珍漕南"
  meaning: string; // Chinese Meaning e.g., "持明護天"
}

// A subset of the provided Dharma Names for demonstration
// Corrected based on user feedback: name = Tibetan, phonetic = Chinese Transcription
export const dharmaNameList: DharmaNameEntry[] = [
  { id: 1, name: "རིག་འཛིན་འཚོ་གནམ།", phonetic: "仁珍漕南", meaning: "持明護天" },
  { id: 2, name: "རིག་འཛིན་འཚོ་ས།", phonetic: "仁珍漕薩", meaning: "持明護地" },
  { id: 3, name: "རིག་འཛིན་འཚོ་ཟབ།", phonetic: "仁珍漕灑", meaning: "持明護玄" },
  { id: 4, name: "རིག་འཛིན་འཚོ་སྣོད།", phonetic: "仁珍漕耨", meaning: "持明護宇" },
  { id: 5, name: "རིག་འཛིན་འཚོ་དུས།", phonetic: "仁珍漕迪", meaning: "持明護宙" },
  // ... (more entries can be added here)
  { id: 36, name: "རིག་འཛིན་འཚོ་སྐར།", phonetic: "仁珍漕咯", meaning: "持明護星" },
  { id: 37, name: "རིག་འཛིན་འཚོ་གསྣོལ།", phonetic: "仁珍漕搜", meaning: "持明護斬" },
  { id: 38, name: "རིག་འཛིན་འཚོ་ཁྱད།", phonetic: "仁珍漕夏", meaning: "持明護萬" },
  // ...
  { id: 41, name: "རིག་འཛིན་འཚོ་རྟག།", phonetic: "仁珍漕大", meaning: "持明護常" },
  { id: 42, name: "རིག་འཛིན་འཚོ་འདུན།", phonetic: "仁珍漕願", meaning: "持明護恭" },
  { id: 43, name: "རིག་འཛིན་འཚོ་བརིད།", phonetic: "仁珍漕烱", meaning: "持明護鞠" },
  { id: 44, name: "རིག་འཛིན་འཚོ་གསོ།", phonetic: "仁珍漕養", meaning: "持明護養" },
  // Add a few more to make the list a bit longer for testing "all used"
  { id: 45, name: "རིག་འཛིན་འཚོ་འབོད།", phonetic: "仁珍漕讀", meaning: "持明護嘉" },
  { id: 46, name: "རིག་འཛིན་འཚོ་དག", phonetic: "仁珍漕敦", meaning: "持明護潔" },
  { id: 47, name: "རིག་འཛིན་འཚོ་རྒྱས།", phonetic: "仁珍漕寰", meaning: "持明護效" },
  { id: 48, name: "རིག་འཛིན་འཚོ་སོབས།", phonetic: "仁珍漕救", meaning: "持明護才" },
  { id: 49, name: "རིག་འཛིན་འཚོ་བཟང༌།", phonetic: "仁珍漕雷", meaning: "持明護良" },
  { id: 50, name: "རིག་འཛིན་འཚོ་ཤེས།", phonetic: "仁珍漕謝", meaning: "持明護知" },
];