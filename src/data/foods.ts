export type GameMode = 'europe' | 'world';

export interface FoodItem {
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  imageQuery: string;
}

const europeanFoods: FoodItem[] = [
  // Italy
  { name: 'Pizza Napoletana', country: 'Włochy', coordinates: [14.2681, 40.8518], imageQuery: 'pizza napoletana' },
  { name: 'Carbonara', country: 'Włochy', coordinates: [12.4964, 41.9028], imageQuery: 'pasta carbonara' },
  { name: 'Risotto', country: 'Włochy', coordinates: [9.1900, 45.4642], imageQuery: 'risotto milanese' },
  
  // France
  { name: 'Croissant', country: 'Francja', coordinates: [2.3522, 48.8566], imageQuery: 'french croissant' },
  { name: 'Ratatouille', country: 'Francja', coordinates: [7.2661, 43.7034], imageQuery: 'ratatouille' },
  { name: 'Coq au Vin', country: 'Francja', coordinates: [4.8357, 45.7640], imageQuery: 'coq au vin' },
  
  // Spain
  { name: 'Paella', country: 'Hiszpania', coordinates: [-0.3763, 39.4699], imageQuery: 'paella valenciana' },
  { name: 'Gazpacho', country: 'Hiszpania', coordinates: [-5.9845, 37.3891], imageQuery: 'gazpacho andalusian' },
  { name: 'Churros', country: 'Hiszpania', coordinates: [-3.7038, 40.4168], imageQuery: 'churros chocolate' },
  
  // Greece
  { name: 'Moussaka', country: 'Grecja', coordinates: [23.7275, 37.9838], imageQuery: 'moussaka greek' },
  { name: 'Souvlaki', country: 'Grecja', coordinates: [23.7275, 37.9838], imageQuery: 'souvlaki' },
  
  // Poland
  { name: 'Pierogi', country: 'Polska', coordinates: [21.0122, 52.2297], imageQuery: 'polish pierogi' },
  { name: 'Bigos', country: 'Polska', coordinates: [21.0122, 52.2297], imageQuery: 'bigos polish' },
  { name: 'Żurek', country: 'Polska', coordinates: [21.0122, 52.2297], imageQuery: 'zurek soup' },
  
  // Germany
  { name: 'Bratwurst', country: 'Niemcy', coordinates: [10.4515, 51.1657], imageQuery: 'german bratwurst' },
  { name: 'Schnitzel', country: 'Niemcy', coordinates: [11.5755, 48.1351], imageQuery: 'schnitzel german' },
  
  // Austria
  { name: 'Sachertorte', country: 'Austria', coordinates: [16.3738, 48.2082], imageQuery: 'sachertorte vienna' },
  
  // Hungary
  { name: 'Goulash', country: 'Węgry', coordinates: [19.0402, 47.4979], imageQuery: 'hungarian goulash' },
  
  // UK
  { name: 'Fish and Chips', country: 'Wielka Brytania', coordinates: [-0.1276, 51.5074], imageQuery: 'fish and chips british' },
  
  // Belgium
  { name: 'Moules-frites', country: 'Belgia', coordinates: [4.3517, 50.8503], imageQuery: 'moules frites belgian' },
  
  // Portugal
  { name: 'Pastéis de Nata', country: 'Portugalia', coordinates: [-9.1393, 38.7223], imageQuery: 'pastel de nata' },
  { name: 'Bacalhau', country: 'Portugalia', coordinates: [-9.1393, 38.7223], imageQuery: 'bacalhau portuguese' },
  
  // Sweden
  { name: 'Köttbullar', country: 'Szwecja', coordinates: [18.0686, 59.3293], imageQuery: 'swedish meatballs' },
  
  // Turkey
  { name: 'Kebab', country: 'Turcja', coordinates: [28.9784, 41.0082], imageQuery: 'turkish kebab' },
  { name: 'Baklava', country: 'Turcja', coordinates: [28.9784, 41.0082], imageQuery: 'baklava turkish' },
];

const worldFoods: FoodItem[] = [
  ...europeanFoods,
  
  // Japan
  { name: 'Sushi', country: 'Japonia', coordinates: [139.6917, 35.6895], imageQuery: 'sushi japanese' },
  { name: 'Ramen', country: 'Japonia', coordinates: [139.6917, 35.6895], imageQuery: 'ramen japanese' },
  { name: 'Takoyaki', country: 'Japonia', coordinates: [135.5023, 34.6937], imageQuery: 'takoyaki' },
  
  // Thailand
  { name: 'Pad Thai', country: 'Tajlandia', coordinates: [100.5018, 13.7563], imageQuery: 'pad thai' },
  { name: 'Tom Yum', country: 'Tajlandia', coordinates: [100.5018, 13.7563], imageQuery: 'tom yum soup' },
  
  // India
  { name: 'Biryani', country: 'Indie', coordinates: [78.4744, 17.3850], imageQuery: 'biryani indian' },
  { name: 'Butter Chicken', country: 'Indie', coordinates: [77.2090, 28.6139], imageQuery: 'butter chicken' },
  { name: 'Masala Dosa', country: 'Indie', coordinates: [77.5946, 12.9716], imageQuery: 'masala dosa' },
  
  // China
  { name: 'Peking Duck', country: 'Chiny', coordinates: [116.4074, 39.9042], imageQuery: 'peking duck' },
  { name: 'Dim Sum', country: 'Chiny', coordinates: [114.1095, 22.3964], imageQuery: 'dim sum chinese' },
  { name: 'Mapo Tofu', country: 'Chiny', coordinates: [104.0668, 30.5728], imageQuery: 'mapo tofu' },
  
  // Vietnam
  { name: 'Pho', country: 'Wietnam', coordinates: [105.8342, 21.0285], imageQuery: 'pho vietnamese' },
  { name: 'Banh Mi', country: 'Wietnam', coordinates: [106.6297, 10.8231], imageQuery: 'banh mi vietnamese' },
  
  // Mexico
  { name: 'Tacos', country: 'Meksyk', coordinates: [-99.1332, 19.4326], imageQuery: 'tacos mexican' },
  { name: 'Mole', country: 'Meksyk', coordinates: [-98.2063, 19.0414], imageQuery: 'mole poblano' },
  { name: 'Guacamole', country: 'Meksyk', coordinates: [-99.1332, 19.4326], imageQuery: 'guacamole mexican' },
  
  // USA
  { name: 'Burger', country: 'USA', coordinates: [-95.7129, 37.0902], imageQuery: 'american burger' },
  { name: 'BBQ Ribs', country: 'USA', coordinates: [-90.0490, 35.1495], imageQuery: 'bbq ribs american' },
  
  // Brazil
  { name: 'Feijoada', country: 'Brazylia', coordinates: [-43.1729, -22.9068], imageQuery: 'feijoada brazilian' },
  { name: 'Açaí Bowl', country: 'Brazylia', coordinates: [-43.1729, -22.9068], imageQuery: 'acai bowl brazilian' },
  
  // Argentina
  { name: 'Asado', country: 'Argentyna', coordinates: [-58.3816, -34.6037], imageQuery: 'asado argentinian' },
  { name: 'Empanadas', country: 'Argentyna', coordinates: [-58.3816, -34.6037], imageQuery: 'empanadas argentinian' },
  
  // Peru
  { name: 'Ceviche', country: 'Peru', coordinates: [-77.0428, -12.0464], imageQuery: 'ceviche peruvian' },
  
  // Morocco
  { name: 'Tagine', country: 'Maroko', coordinates: [-7.9811, 31.6295], imageQuery: 'tagine moroccan' },
  { name: 'Couscous', country: 'Maroko', coordinates: [-7.9811, 31.6295], imageQuery: 'couscous moroccan' },
  
  // Lebanon
  { name: 'Hummus', country: 'Liban', coordinates: [35.5018, 33.8886], imageQuery: 'hummus lebanese' },
  { name: 'Falafel', country: 'Liban', coordinates: [35.5018, 33.8886], imageQuery: 'falafel lebanese' },
  
  // South Korea
  { name: 'Kimchi', country: 'Korea Południowa', coordinates: [126.9780, 37.5665], imageQuery: 'kimchi korean' },
  { name: 'Bibimbap', country: 'Korea Południowa', coordinates: [126.9780, 37.5665], imageQuery: 'bibimbap korean' },
  
  // Ethiopia
  { name: 'Injera', country: 'Etiopia', coordinates: [38.7469, 9.0320], imageQuery: 'injera ethiopian' },
];

export function getRandomFoods(mode: GameMode, count: number): FoodItem[] {
  const pool = mode === 'europe' ? europeanFoods : worldFoods;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}