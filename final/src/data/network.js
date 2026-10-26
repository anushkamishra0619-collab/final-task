export const stations = {
  vaishali: "Vaishali",
  kaushambi: "Kaushambi",
  indirapuram: "Indirapuram",
  anand_vihar: "Anand Vihar",
  mayur_vihar: "Mayur Vihar",
  akshardham: "Akshardham",
  rajiv_chowk: "Rajiv Chowk",
  new_delhi: "New Delhi",
  dwarka_mor: "Dwarka Mor",
  dwarka_sec21: "Dwarka Sector 21",
  delhi_airport: "Delhi Airport (T3)",
  mumbai_airport: "Mumbai Airport",
};


export const coords = {
  vaishali: [28.645, 77.341],
  kaushambi: [28.641, 77.323],
  indirapuram: [28.640, 77.369],
  anand_vihar: [28.647, 77.316],
  mayur_vihar: [28.604, 77.294],
  akshardham: [28.613, 77.277],
  rajiv_chowk: [28.633, 77.220],
  new_delhi: [28.643, 77.220],
  dwarka_mor: [28.619, 77.033],
  dwarka_sec21: [28.552, 77.058],
  delhi_airport: [28.556, 77.100],
  mumbai_airport: [19.090, 72.866],
};

export const edges = [

  { from: "vaishali", to: "anand_vihar", mode: "metro", line: "Blue", time: 8, distance: 4, reliability: 0.95 },
  { from: "anand_vihar", to: "akshardham", mode: "metro", line: "Blue", time: 12, distance: 9, reliability: 0.95 },
  { from: "mayur_vihar", to: "akshardham", mode: "metro", line: "Blue", time: 6, distance: 4, reliability: 0.95 },
  { from: "akshardham", to: "rajiv_chowk", mode: "metro", line: "Blue", time: 14, distance: 13, reliability: 0.95 },
  { from: "rajiv_chowk", to: "dwarka_mor", mode: "metro", line: "Blue", time: 28, distance: 20, reliability: 0.95 },
  { from: "dwarka_mor", to: "dwarka_sec21", mode: "metro", line: "Blue", time: 10, distance: 6, reliability: 0.95 },

  { from: "rajiv_chowk", to: "new_delhi", mode: "metro", line: "Yellow", time: 4, distance: 1.5, reliability: 0.96 },
  { from: "new_delhi", to: "delhi_airport", mode: "metro", line: "Airport Express", time: 19, distance: 18, reliability: 0.97 },

  { from: "anand_vihar", to: "new_delhi", mode: "train", line: "Local", time: 20, distance: 7, reliability: 0.8 },


  { from: "indirapuram", to: "vaishali", mode: "bus", line: "Bus 55", time: 10, distance: 4, reliability: 0.75 },
  { from: "indirapuram", to: "anand_vihar", mode: "bus", line: "Bus 77", time: 18, distance: 9, reliability: 0.65 },
  { from: "kaushambi", to: "anand_vihar", mode: "bus", line: "Bus 101", time: 12, distance: 3, reliability: 0.7 },
  { from: "anand_vihar", to: "rajiv_chowk", mode: "bus", line: "Bus 440", time: 35, distance: 12, reliability: 0.6 },
  { from: "mayur_vihar", to: "anand_vihar", mode: "bus", line: "Bus 12", time: 22, distance: 8, reliability: 0.7 },
  { from: "dwarka_sec21", to: "delhi_airport", mode: "bus", line: "Bus 748", time: 30, distance: 10, reliability: 0.65 },


  { from: "vaishali", to: "rajiv_chowk", mode: "car", line: "Car", time: 28, distance: 16, reliability: 0.85 },
  { from: "rajiv_chowk", to: "delhi_airport", mode: "car", line: "Car", time: 30, distance: 17, reliability: 0.85 },
  { from: "dwarka_sec21", to: "delhi_airport", mode: "car", line: "Car", time: 15, distance: 7, reliability: 0.85 },

  { from: "delhi_airport", to: "mumbai_airport", mode: "plane", line: "Flight", time: 135, distance: 1150, reliability: 0.88 },

  { from: "vaishali", to: "kaushambi", mode: "walk", line: "Walk", time: 15, distance: 1.2, reliability: 1 },
  { from: "rajiv_chowk", to: "new_delhi", mode: "walk", line: "Walk", time: 12, distance: 0.9, reliability: 1 },
];


export const findStationId = (text) =>
  Object.keys(stations).find(
    (id) => stations[id].toLowerCase() === text.trim().toLowerCase()
  ) || null;