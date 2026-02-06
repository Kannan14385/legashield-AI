
import React, { useState, useEffect } from 'react';
import { analyzeContract } from './services/geminiService';
import { ContractAnalysisResult, ContractTemplate } from './types';
import { MOCK_TEMPLATES } from './constants';
import { Dashboard } from './components/Dashboard';
import { ClauseList } from './components/ClauseList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANALYZE' | 'TEMPLATES' | 'HISTORY'>('ANALYZE');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysisResult | null>(null);
  const [history, setHistory] = useState<ContractAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('legashield_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (newAnalysis: ContractAnalysisResult) => {
    const updatedHistory = [newAnalysis, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('legashield_history', JSON.stringify(updatedHistory));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const runAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeContract(inputText);
      setAnalysis(result);
      saveToHistory(result);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the contract. Please ensure your text is valid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('legashield_history', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => {setAnalysis(null); setActiveTab('ANALYZE');}}>
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <i className="fas fa-gavel text-white text-xl"></i>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  LegaShield AI
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SME Legal Partner</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {setActiveTab('ANALYZE'); setAnalysis(null);}}
                className={`text-sm font-semibold transition-colors ${activeTab === 'ANALYZE' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                New Analysis
              </button>
              <button 
                onClick={() => setActiveTab('TEMPLATES')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'TEMPLATES' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Templates
              </button>
              <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Audit Trail
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'ANALYZE' && (
          <div className="space-y-8">
            {!analysis ? (
              <div className="max-w-3xl mx-auto text-center space-y-8 py-12 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span>GenAI Powered Legal Reasoning</span>
                </div>
                <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  Stop signing contracts <br/>
                  <span className="text-blue-600">you don't understand.</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Upload any business agreement. We'll find hidden risks, translate legal jargon, and suggest fairer terms specifically for the Indian market.
                </p>

                <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fas fa-file-signature text-9xl"></i>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-blue-400 hover:bg-slate-50 transition-all group cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".txt" 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                      <i className="fas fa-file-alt text-3xl text-blue-500"></i>
                    </div>
                    <p className="text-slate-800 font-bold">Drop your contract file here</p>
                    <p className="text-xs text-slate-400 mt-2">Currently supports .txt (PDF/Docx OCR coming soon)</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">or paste clause text</span>
                    </div>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste the agreement text here..."
                    className="w-full h-48 p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none text-sm font-mono bg-slate-50/50 transition-all"
                  ></textarea>

                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing || !inputText.trim()}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center space-x-2 ${
                      isAnalyzing || !inputText.trim() 
                        ? 'bg-slate-300 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:shadow-blue-200'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="fas fa-brain fa-spin mr-2"></i>
                        <span>Processing Legal Logic...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bolt mr-2"></i>
                        <span>Start Risk Assessment</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex justify-center items-center space-x-8 text-slate-400 grayscale opacity-70">
                   <div className="flex items-center space-x-2"><i className="fas fa-check-circle"></i><span className="text-[10px] font-bold uppercase tracking-widest">Confidential</span></div>
                   <div className="flex items-center space-x-2"><i className="fas fa-check-circle"></i><span className="text-[10px] font-bold uppercase tracking-widest">Indian Law Context</span></div>
                   <div className="flex items-center space-x-2"><i className="fas fa-check-circle"></i><span className="text-[10px] font-bold uppercase tracking-widest">Plain Language</span></div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <button 
                      onClick={() => setAnalysis(null)}
                      className="text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center mb-4 transition-colors"
                    >
                      <i className="fas fa-arrow-left mr-2"></i> Back to Uploader
                    </button>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                      Analysis Report: <span className="text-blue-600">{analysis.contractType}</span>
                    </h2>
                    <p className="text-slate-500 font-medium flex items-center mt-1">
                      <i className="far fa-clock mr-2"></i> Generated on {new Date(analysis.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-3 w-full md:w-auto">
                    <button 
                      onClick={handlePrint}
                      className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      <i className="fas fa-file-pdf mr-2 text-red-500"></i> Export PDF
                    </button>
                  </div>
                </div>

                <Dashboard analysis={analysis} />
                <ClauseList clauses={analysis.clauses} />

                <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Discuss this with a Lawyer</h3>
                        <p className="text-blue-200 text-sm max-w-md">LegaShield provides AI guidance, but legal representation is crucial for signing. Share this report with your legal team for faster review.</p>
                      </div>
                      <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-extrabold hover:bg-blue-50 transition-all shadow-xl">
                          Share Report
                        </button>
                        <button className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-extrabold hover:bg-white/10 transition-all">
                          Expert Review
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'TEMPLATES' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Vetted Indian Contract Templates</h1>
              <p className="text-slate-600 text-lg">Download balanced, SME-focused agreements that protect your interests without complicating business relationships.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MOCK_TEMPLATES.map((template) => (
                <div key={template.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col group">
                  <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:rotate-12 transition-all">
                    <i className="fas fa-file-contract text-blue-600 group-hover:text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{template.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">{template.description}</p>
                  <button className="w-full py-3.5 bg-slate-50 hover:bg-blue-50 rounded-xl font-bold text-slate-600 hover:text-blue-600 border border-slate-100 transition-all">
                    Download .docx
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-slate-900">Analysis History</h1>
                <button 
                  onClick={() => {localStorage.removeItem('legashield_history'); setHistory([]);}}
                  className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline"
                >
                  Clear All
                </button>
             </div>
             
             {history.length > 0 ? (
               <div className="space-y-4">
                 {history.map((item) => (
                   <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer group" onClick={() => {setAnalysis(item); setActiveTab('ANALYZE');}}>
                      <div className="flex items-center space-x-6">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${item.compositeRiskScore > 60 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {item.compositeRiskScore}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-800">{item.contractType}</h4>
                            <p className="text-xs text-slate-400 font-medium">Analyzed on {new Date(item.timestamp).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-4">
                         <span className="hidden md:inline-block px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase">{item.clauses.length} Clauses</span>
                         <button 
                           onClick={(e) => {e.stopPropagation(); deleteHistoryItem(item.id);}}
                           className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                            <i className="fas fa-trash-alt"></i>
                         </button>
                         <i className="fas fa-chevron-right text-slate-200 group-hover:translate-x-1 transition-transform"></i>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <i className="fas fa-history text-3xl text-slate-200"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No past analyses found</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">Start by uploading a contract to see your history and audit trail here.</p>
               </div>
             )}
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center shadow-sm animate-bounce">
            <i className="fas fa-exclamation-circle text-xl mr-4"></i>
            <div>
              <p className="font-bold">Analysis Interrupted</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 border-t border-slate-100 text-center pb-10">
         <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em] mb-4">Empowering 63 Million Indian SMEs</p>
         <div className="flex justify-center space-x-6 text-slate-300">
            <i className="fab fa-twitter hover:text-blue-400 cursor-pointer transition-colors"></i>
            <i className="fab fa-linkedin hover:text-blue-700 cursor-pointer transition-colors"></i>
            <i className="fab fa-github hover:text-slate-900 cursor-pointer transition-colors"></i>
         </div>
      </footer>

      {/* Persistent Mobile Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-full px-8 py-4 flex md:hidden items-center space-x-10 z-50">
        <button onClick={() => {setActiveTab('ANALYZE'); setAnalysis(null);}} className={`text-xl ${activeTab === 'ANALYZE' ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-plus-circle"></i>
        </button>
        <button onClick={() => setActiveTab('TEMPLATES')} className={`text-xl ${activeTab === 'TEMPLATES' ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-layer-group"></i>
        </button>
        <button onClick={() => setActiveTab('HISTORY')} className={`text-xl ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-400'}`}>
          <i className="fas fa-history"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
