
import React, { useState } from 'react';
import { ClauseAnalysis, RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';

interface ClauseListProps {
  clauses: ClauseAnalysis[];
}

const CATEGORY_ICONS: Record<string, string> = {
  FINANCIAL: 'fa-money-bill-wave',
  LIABILITY: 'fa-user-shield',
  TERMINATION: 'fa-ban',
  IP: 'fa-lightbulb',
  CONFIDENTIALITY: 'fa-user-secret',
  JURISDICTION: 'fa-map-marker-alt',
  OBLIGATION: 'fa-tasks',
  OTHER: 'fa-file-alt'
};

export const ClauseList: React.FC<ClauseListProps> = ({ clauses }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'RISKY'>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredClauses = activeTab === 'RISKY' 
    ? clauses.filter(c => c.riskLevel === RiskLevel.HIGH || c.riskLevel === RiskLevel.CRITICAL)
    : clauses;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Clause-by-Clause Deep Dive</h2>
          <p className="text-xs text-slate-500">Legal concepts translated to plain language</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'ALL' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            All Clauses ({clauses.length})
          </button>
          <button
            onClick={() => setActiveTab('RISKY')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'RISKY' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
          >
            Risky Only ({clauses.filter(c => c.riskLevel === RiskLevel.HIGH || c.riskLevel === RiskLevel.CRITICAL).length})
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredClauses.map((clause, idx) => (
          <div key={idx} className={`transition-colors ${expandedIndex === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>
            <button
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              className="w-full text-left p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500 text-[10px]">
                    <i className={`fas ${CATEGORY_ICONS[clause.category] || CATEGORY_ICONS.OTHER} mr-1`}></i>
                    <span className="font-bold uppercase tracking-tighter">{clause.category}</span>
                  </div>
                  <RiskBadge level={clause.riskLevel} />
                </div>
                <h4 className="text-md font-semibold text-slate-800">{clause.title}</h4>
              </div>
              <i className={`fas fa-chevron-${expandedIndex === idx ? 'up' : 'down'} text-slate-400 mt-1`}></i>
            </button>

            {expandedIndex === idx && (
              <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Original Text</h5>
                      <p className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed max-h-40 overflow-y-auto italic font-serif">
                        "{clause.originalText}"
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Simplified Breakdown</h5>
                      <div className="text-sm text-slate-800 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        {clause.explanation}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {clause.riskReason && (
                      <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                        <h5 className="text-xs font-bold text-red-600 uppercase mb-2 flex items-center">
                          <i className="fas fa-exclamation-triangle mr-2"></i>
                          Red Flag Explanation
                        </h5>
                        <p className="text-sm text-slate-700 leading-relaxed">{clause.riskReason}</p>
                      </div>
                    )}
                    {clause.suggestedAlternative && (
                      <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
                        <h5 className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center">
                          <i className="fas fa-handshake mr-2"></i>
                          Negotiation Strategy
                        </h5>
                        <div className="text-sm text-slate-700 leading-relaxed prose prose-sm">
                           <p className="font-medium text-slate-800 mb-1 italic">Suggest this instead:</p>
                           {clause.suggestedAlternative}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredClauses.length === 0 && (
          <div className="p-16 text-center text-slate-400">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-2xl opacity-40"></i>
            </div>
            <p className="text-sm font-medium">No critical risks identified in this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
