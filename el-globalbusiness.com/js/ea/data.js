// js/ea/data.js
// El-Access flight data: EXAMPLE FARES. There is no live feed yet; edit this file to change
// what the site shows. Everything on the El-Access pages (the board, routes, search, flight
// pages) reads from here.
//
// How to edit
//   AIRPORTS  code: [city, airport name, country, latitude, longitude]
//             Latitude and longitude give the flight time; look them up once per airport.
//   AIRCRAFT  name: [category, seats, cruise speed in knots]
//   FLIGHTS   one empty leg per line:
//             id      unique, used in the flight page's address (flight.html?id=EA101)
//             from/to airport codes from AIRPORTS
//             aircraft a name from AIRCRAFT
//             day     days from today (0 = today, 1 = tomorrow). Dates are worked out when the
//                     page loads, so example flights never go out of date.
//             window  the departure window, local time
//             price   the empty-leg price for the whole aircraft, in US dollars
//             charter a comparable full charter on the same route, for the saving shown
//   ROUTES    the popular routes shown as photo cards on the home page.
//
// When a real feed arrives, replace FLIGHTS with its data in the same shape.

export const EXAMPLE = true; // shows the "Example fares" note; set to false once fares are real

export const AIRPORTS = {
  FAB: ['London', 'Farnborough', 'United Kingdom', 51.28, -0.78],
  LTN: ['London', 'Luton', 'United Kingdom', 51.87, -0.37],
  BQH: ['London', 'Biggin Hill', 'United Kingdom', 51.33, 0.03],
  LBG: ['Paris', 'Le Bourget', 'France', 48.97, 2.44],
  NCE: ['Nice', 'Côte d’Azur', 'France', 43.66, 7.21],
  GVA: ['Geneva', 'Geneva', 'Switzerland', 46.24, 6.11],
  ZRH: ['Zurich', 'Zurich', 'Switzerland', 47.46, 8.55],
  MAD: ['Madrid', 'Barajas', 'Spain', 40.47, -3.56],
  IBZ: ['Ibiza', 'Ibiza', 'Spain', 38.87, 1.37],
  PMI: ['Palma', 'Son Sant Joan', 'Spain', 39.55, 2.73],
  DWC: ['Dubai', 'Al Maktoum', 'United Arab Emirates', 24.9, 55.16],
  LOS: ['Lagos', 'Murtala Muhammed', 'Nigeria', 6.58, 3.32],
  ACC: ['Accra', 'Kotoka', 'Ghana', 5.61, -0.17],
  HLA: ['Johannesburg', 'Lanseria', 'South Africa', -25.94, 27.93],
  CPT: ['Cape Town', 'Cape Town', 'South Africa', -33.97, 18.6],
  TEB: ['New York', 'Teterboro', 'United States', 40.85, -74.06],
  OPF: ['Miami', 'Opa-locka', 'United States', 25.91, -80.28],
  PBI: ['Palm Beach', 'Palm Beach', 'United States', 26.68, -80.1],
  VNY: ['Los Angeles', 'Van Nuys', 'United States', 34.21, -118.49],
  LAS: ['Las Vegas', 'Harry Reid', 'United States', 36.08, -115.15],
  ASE: ['Aspen', 'Aspen', 'United States', 39.22, -106.87],
};

export const AIRCRAFT = {
  'Pilatus PC-12': ['Turboprop', 8, 280],
  'Phenom 300E': ['Light jet', 7, 450],
  'Citation CJ3+': ['Light jet', 7, 415],
  'Citation XLS+': ['Midsize jet', 8, 440],
  'Learjet 75': ['Midsize jet', 8, 460],
  'Challenger 350': ['Super midsize jet', 9, 470],
  'Praetor 600': ['Super midsize jet', 10, 466],
  'Gulfstream G450': ['Heavy jet', 14, 476],
  'Falcon 7X': ['Heavy jet', 14, 488],
  'Gulfstream G650': ['Ultra long range', 16, 516],
  'Global 6500': ['Ultra long range', 14, 488],
};

export const FLIGHTS = [
  { id: 'EA101', from: 'FAB', to: 'NCE', aircraft: 'Citation XLS+', day: 1, window: '09:00–13:00', price: 5600, charter: 16500 },
  { id: 'EA102', from: 'LTN', to: 'NCE', aircraft: 'Phenom 300E', day: 2, window: '07:30–11:00', price: 4150, charter: 13750 },
  { id: 'EA103', from: 'BQH', to: 'NCE', aircraft: 'Challenger 350', day: 4, window: '12:00–17:00', price: 7950, charter: 19550 },
  { id: 'EA104', from: 'FAB', to: 'NCE', aircraft: 'Gulfstream G450', day: 6, window: '10:00–15:00', price: 7650, charter: 26850 },
  { id: 'EA105', from: 'LBG', to: 'FAB', aircraft: 'Citation CJ3+', day: 0, window: '16:00–20:00', price: 2700, charter: 7000 },
  { id: 'EA106', from: 'LBG', to: 'LTN', aircraft: 'Learjet 75', day: 2, window: '08:00–12:00', price: 2950, charter: 8550 },
  { id: 'EA107', from: 'LBG', to: 'BQH', aircraft: 'Phenom 300E', day: 5, window: '13:00–18:00', price: 2000, charter: 7000 },
  { id: 'EA108', from: 'FAB', to: 'DWC', aircraft: 'Gulfstream G650', day: 3, window: '21:00–23:59', price: 56450, charter: 149850 },
  { id: 'EA109', from: 'LTN', to: 'DWC', aircraft: 'Falcon 7X', day: 8, window: '09:00–12:00', price: 32550, charter: 117100 },
  { id: 'EA110', from: 'DWC', to: 'FAB', aircraft: 'Global 6500', day: 1, window: '02:00–06:00', price: 53350, charter: 147750 },
  { id: 'EA111', from: 'OPF', to: 'TEB', aircraft: 'Challenger 350', day: 0, window: '17:00–21:00', price: 8450, charter: 29700 },
  { id: 'EA112', from: 'PBI', to: 'TEB', aircraft: 'Citation XLS+', day: 1, window: '07:00–10:00', price: 6800, charter: 23600 },
  { id: 'EA113', from: 'OPF', to: 'TEB', aircraft: 'Praetor 600', day: 3, window: '11:00–15:00', price: 11000, charter: 30650 },
  { id: 'EA114', from: 'TEB', to: 'OPF', aircraft: 'Learjet 75', day: 2, window: '06:30–09:30', price: 10050, charter: 22600 },
  { id: 'EA115', from: 'TEB', to: 'PBI', aircraft: 'Gulfstream G450', day: 5, window: '14:00–18:00', price: 11400, charter: 38550 },
  { id: 'EA116', from: 'GVA', to: 'FAB', aircraft: 'Citation XLS+', day: 1, window: '15:00–19:00', price: 4200, charter: 13300 },
  { id: 'EA117', from: 'FAB', to: 'GVA', aircraft: 'Phenom 300E', day: 3, window: '08:00–11:00', price: 4400, charter: 10900 },
  { id: 'EA118', from: 'ZRH', to: 'LTN', aircraft: 'Challenger 350', day: 4, window: '10:00–14:00', price: 7900, charter: 16850 },
  { id: 'EA119', from: 'FAB', to: 'GVA', aircraft: 'Falcon 7X', day: 7, window: '12:00–16:00', price: 9100, charter: 23200 },
  { id: 'EA120', from: 'HLA', to: 'CPT', aircraft: 'Citation XLS+', day: 0, window: '14:00–18:00', price: 6750, charter: 19050 },
  { id: 'EA121', from: 'HLA', to: 'CPT', aircraft: 'Challenger 350', day: 2, window: '09:00–13:00', price: 10950, charter: 23050 },
  { id: 'EA122', from: 'CPT', to: 'HLA', aircraft: 'Phenom 300E', day: 4, window: '07:00–11:00', price: 4350, charter: 15500 },
  { id: 'EA123', from: 'FAB', to: 'MAD', aircraft: 'Citation CJ3+', day: 2, window: '09:00–14:00', price: 6650, charter: 14750 },
  { id: 'EA124', from: 'LTN', to: 'MAD', aircraft: 'Challenger 350', day: 6, window: '11:00–15:00', price: 7750, charter: 23400 },
  { id: 'EA125', from: 'LBG', to: 'MAD', aircraft: 'Learjet 75', day: 3, window: '13:00–17:00', price: 4650, charter: 15450 },
  { id: 'EA126', from: 'LOS', to: 'FAB', aircraft: 'Global 6500', day: 2, window: '22:00–23:59', price: 39550, charter: 134150 },
  { id: 'EA127', from: 'ACC', to: 'LOS', aircraft: 'Phenom 300E', day: 1, window: '10:00–14:00', price: 2600, charter: 7750 },
  { id: 'EA128', from: 'LOS', to: 'ACC', aircraft: 'Citation XLS+', day: 4, window: '08:00–12:00', price: 4150, charter: 9350 },
  { id: 'EA129', from: 'LOS', to: 'DWC', aircraft: 'Gulfstream G450', day: 5, window: '01:00–05:00', price: 35750, charter: 116050 },
  { id: 'EA130', from: 'MAD', to: 'IBZ', aircraft: 'Citation CJ3+', day: 1, window: '10:00–14:00', price: 3150, charter: 8000 },
  { id: 'EA131', from: 'LBG', to: 'IBZ', aircraft: 'Challenger 350', day: 3, window: '09:00–12:00', price: 8550, charter: 21150 },
  { id: 'EA132', from: 'FAB', to: 'PMI', aircraft: 'Citation XLS+', day: 4, window: '08:00–12:00', price: 6900, charter: 19800 },
  { id: 'EA133', from: 'GVA', to: 'PMI', aircraft: 'Phenom 300E', day: 6, window: '11:00–15:00', price: 4350, charter: 11250 },
  { id: 'EA134', from: 'VNY', to: 'LAS', aircraft: 'Citation CJ3+', day: 0, window: '18:00–22:00', price: 2050, charter: 7200 },
  { id: 'EA135', from: 'LAS', to: 'VNY', aircraft: 'Phenom 300E', day: 1, window: '09:00–13:00', price: 2100, charter: 7450 },
  { id: 'EA136', from: 'VNY', to: 'ASE', aircraft: 'Challenger 350', day: 2, window: '08:00–11:00', price: 6850, charter: 21800 },
  { id: 'EA137', from: 'ASE', to: 'VNY', aircraft: 'Learjet 75', day: 5, window: '13:00–17:00', price: 6850, charter: 16650 },
  { id: 'EA138', from: 'VNY', to: 'LAS', aircraft: 'Pilatus PC-12', day: 3, window: '07:00–10:00', price: 2150, charter: 6000 },
  { id: 'EA139', from: 'TEB', to: 'ASE', aircraft: 'Praetor 600', day: 4, window: '08:00–12:00', price: 15100, charter: 45000 },
  { id: 'EA140', from: 'NCE', to: 'GVA', aircraft: 'Pilatus PC-12', day: 2, window: '12:00–16:00', price: 2150, charter: 5450 },
];

// Popular routes on the home page: city to city (any airport in each city), with a photo.
export const ROUTES = [
  { from: 'London', to: 'Dubai', photo: 'dubai-burj-khalifa', alt: 'Dubai at dusk, the Burj Khalifa above the city' },
  { from: 'Miami', to: 'New York', photo: 'new-york-skyline-twilight', alt: 'The Manhattan skyline at twilight' },
  { from: 'Paris', to: 'London', photo: 'london-tower-bridge', alt: 'Tower Bridge in London' },
  { from: 'London', to: 'Geneva', photo: 'swiss-alps', alt: 'The Swiss Alps under snow' },
  { from: 'Johannesburg', to: 'Cape Town', photo: 'cape-town-table-mountain', alt: 'Table Mountain above Cape Town' },
  { from: 'London', to: 'Madrid', photo: 'madrid-skyline', alt: 'The Madrid skyline' },
];
