
export interface Taxonomy {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
}

export interface PopulationDataPoint {
  year: number;
  population: number;
}

export interface InsectData {
  name: string;
  scientificName: string;
  taxonomy: Taxonomy;
  summary: string;
  habitat: string;
  ecologicalRole: string;
  threats: string;
  conservationStatus: string;
  populationTrend: PopulationDataPoint[];
  funFacts: string[];
  sustainabilityTip: string;
  impactScore: number;
  extinctionPrediction: string;
  imageUrl: string;
  distributionMapImageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}