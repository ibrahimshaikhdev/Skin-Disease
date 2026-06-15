import { Link } from 'react-router-dom';
import { Upload, ScanSearch, BarChart3, Microscope, ArrowRight, Brain, ShieldCheck, LineChart } from 'lucide-react';
import Disclaimer from '../components/Disclaimer';
import TeamSection from '../components/TeamSection';

const conditions = [
  'Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Psoriasis',
  'Lichen Planus', 'Actinic Keratosis', 'Seborrheic Keratosis', 'Nevus',
  'Tinea Corporis', 'Herpes Simplex', 'Impetigo', 'Molluscum Contagiosum',
  'Dermatofibroma', 'Vascular Lesion', 'Mycosis Fungoides', 'Pityriasis Rosea',
];

const features = [
  {
    icon: Brain,
    title: 'Custom-Trained Deep Learning Model',
    text: 'A single unified model trained to recognize 25+ distinct skin conditions from a dermatological image.',
  },
  {
    icon: ScanSearch,
    title: 'Disease Insights',
    text: 'Each prediction comes with an overview, symptoms, risk indicators, and precautions for the detected condition.',
  },
  {
    icon: BarChart3,
    title: 'Confidence Breakdown',
    text: 'See the full probability distribution across all conditions, not just the top guess.',
  },
  {
    icon: LineChart,
    title: 'Analytics Dashboard',
    text: 'Track your analysis history with trends, model usage, and most-detected conditions.',
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan/20 flex items-center justify-center border border-cyan/30">
            <Microscope size={32} className="text-cyan-light" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            DermacareVision AI
          </h1>
          <p className="text-lg text-cyan-pale/80 max-w-2xl mx-auto mb-8">
            Intelligent skin lesion analysis powered by a custom-trained deep learning model.
            Upload a dermatological image and receive an AI-assisted classification
            across 25+ skin conditions, with explainable heatmaps and clinical insights.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan text-navy font-semibold rounded-xl hover:bg-cyan-light transition-colors shadow-lg shadow-cyan/25 no-underline text-base"
          >
            Start Analysis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* The model */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-cyan flex items-center justify-center text-white shrink-0">
              <Brain size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">DermaVision Skin Analyzer</h2>
              <p className="text-text-secondary text-sm">Custom Deep Learning Model · 25+ conditions</p>
            </div>
            <span className="sm:ml-auto text-sm font-medium px-3 py-1.5 rounded-full bg-success/10 text-success flex items-center gap-1.5">
              <ShieldCheck size={14} /> ~92% accuracy
            </span>
          </div>

          <p className="text-text-secondary mb-6">
            A modern transformer-based model that analyzes the uploaded image and
            ranks the most likely conditions. Detectable conditions include:
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {conditions.map((c) => (
              <span key={c} className="text-sm px-3 py-1 rounded-full bg-surface text-text-secondary border border-border">
                {c}
              </span>
            ))}
            <span className="text-sm px-3 py-1 rounded-full bg-blue/10 text-blue font-medium">
              +15 more
            </span>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue text-white font-medium hover:bg-blue-light transition-colors no-underline"
          >
            <Upload size={18} />
            Analyze an Image
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text text-center mb-10">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <f.icon size={24} className="text-cyan" />
                </div>
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <TeamSection />

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <Disclaimer />
      </section>
    </div>
  );
}
