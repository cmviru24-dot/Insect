
import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { InsectData } from '../types';
import { InfoIcon, MapIcon, SoundIcon, ARIcon, BrainIcon } from './icons';
import AIAssistant from './AIAssistant';
import Quiz from './Quiz';
import { generateInsectSound } from '../services/geminiService';

interface InsectDetailProps {
  data: InsectData;
}

const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white/70 p-4 rounded-lg shadow-md ${className}`}>
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider">{title}</h3>
        <div className="mt-2 text-gray-700">{children}</div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${active ? 'bg-green-800 text-white' : 'text-green-700 hover:bg-green-100'}`}
    >
        {children}
    </button>
);


const InsectDetail: React.FC<InsectDetailProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'map' | 'sound' | 'ar' | 'chat'>('info');

    const renderTabContent = () => {
        switch(activeTab) {
            case 'info': return <InfoTab data={data} />;
            case 'map': return <MapTab imageUrl={data.distributionMapImageUrl} />;
            case 'sound': return <SoundTab insectName={data.name} />;
            case 'ar': return <ARTab />;
            case 'chat': return <AIAssistant insectName={data.name} />;
        }
    };
    
    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-green-900">{data.name}</h1>
                <p className="text-xl text-amber-700 italic mt-1">{data.scientificName}</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <img src={data.imageUrl} alt={data.name} className="w-full h-auto object-cover rounded-xl shadow-lg"/>
                </div>
                <div className="lg:col-span-2 space-y-4">
                     <StatCard title="Quick Summary">
                        <p>{data.summary}</p>
                    </StatCard>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Ecological Role" className="text-center"><p className="text-lg font-semibold">{data.ecologicalRole}</p></StatCard>
                        <StatCard title="Conservation" className="text-center"><p className="text-lg font-semibold">{data.conservationStatus}</p></StatCard>
                        <StatCard title="Impact Score" className="text-center"><p className="text-3xl font-bold text-amber-600">{data.impactScore}/100</p></StatCard>
                        <StatCard title="Sustainability Tip" className="col-span-2 md:col-span-4"><p className="text-green-700 text-center p-2 bg-green-100 rounded-md">💡 {data.sustainabilityTip}</p></StatCard>
                    </div>
                </div>
            </div>

            <div>
                <div className="border-b border-green-800/20 flex flex-wrap">
                    <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}><InfoIcon /> Info</TabButton>
                    <TabButton active={activeTab === 'map'} onClick={() => setActiveTab('map')}><MapIcon /> Map</TabButton>
                    <TabButton active={activeTab === 'sound'} onClick={() => setActiveTab('sound')}><SoundIcon /> Sound</TabButton>
                    <TabButton active={activeTab === 'ar'} onClick={() => setActiveTab('ar')}><ARIcon /> AR</TabButton>
                    <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}><BrainIcon /> AI Assistant</TabButton>
                </div>
                <div className="p-4 bg-white rounded-b-lg shadow-inner">
                    {renderTabContent()}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuizCard />
                <FunFactsCard facts={data.funFacts} />
            </div>

        </div>
    );
};

const InfoTab: React.FC<{data: InsectData}> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Taxonomy">
                <ul className="space-y-1 text-sm">
                    {Object.entries(data.taxonomy).map(([key, value]) => (
                        <li key={key}><span className="font-semibold capitalize">{key}:</span> <em>{value}</em></li>
                    ))}
                </ul>
            </StatCard>
            <StatCard title="Habitat & Distribution">
                <p>{data.habitat}</p>
            </StatCard>
        </div>
        <StatCard title="Population Trend">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.populationTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="population" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </StatCard>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Threats"><p>{data.threats}</p></StatCard>
            <StatCard title="AI Extinction Prediction (2050)">
                <p className="font-semibold text-amber-800">{data.extinctionPrediction}</p>
            </StatCard>
        </div>
    </div>
);

const MapTab: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
    <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-2">Global Distribution</h3>
        <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt="Global distribution map" className="w-full h-full object-contain" />
            ) : (
                <p className="text-gray-500">Map data is unavailable.</p>
            )}
        </div>
        <p className="text-sm text-gray-500 mt-2">AI-generated map showing the insect's habitat.</p>
        <div className="mt-4 flex justify-center gap-2">
            <button className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm opacity-50 cursor-not-allowed">Insects near me</button>
            <button className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm opacity-50 cursor-not-allowed">Endangered species</button>
            <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm opacity-50 cursor-not-allowed">Pollinators only</button>
        </div>
    </div>
);

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SoundTab: React.FC<{ insectName: string }> = ({ insectName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playAudio = (buffer: AudioBuffer) => {
        if (!audioContextRef.current) return;
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    };

    const handlePlaySound = async () => {
        if (isLoading) return;
        
        if (audioBuffer) {
            playAudio(audioBuffer);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const base64Audio = await generateInsectSound(insectName);
            const decodedAudio = decode(base64Audio);
            const buffer = await decodeAudioData(decodedAudio, audioContextRef.current, 24000, 1);
            setAudioBuffer(buffer);
            playAudio(buffer);
        } catch (err: any) {
            setError(err.message || 'Could not generate sound.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-48">
            <h3 className="text-lg font-semibold mb-4">Insect Sound</h3>
            <button onClick={handlePlaySound} disabled={isLoading} className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-wait flex items-center justify-center w-[72px] h-[72px]">
                {isLoading ? (
                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <SoundIcon className="w-10 h-10" />
                )}
            </button>
            <p className="text-sm text-gray-500 mt-2 h-4">
                {isLoading ? 'Generating sound...' : (error ? <span className="text-red-500">{error}</span> : 'Tap to play')}
            </p>
        </div>
    );
};

const ARTab: React.FC = () => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Augmented Reality: Mobile Exclusive</h3>
        <p className="text-sm text-gray-600 max-w-sm">
            Our full AR experience to view insects in your world is coming soon to the InsectVerse mobile app!
        </p>
    </div>
);

const QuizCard: React.FC = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Test Your Knowledge</h2>
        <Quiz />
    </div>
);

const FunFactsCard: React.FC<{facts: string[]}> = ({ facts }) => (
    <div className="bg-green-800 text-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BrainIcon /> AI-Generated Fun Facts</h2>
        <ul className="space-y-3 list-disc list-inside">
            {facts.map((fact, index) => (
                <li key={index}>{fact}</li>
            ))}
        </ul>
    </div>
);

export default InsectDetail;