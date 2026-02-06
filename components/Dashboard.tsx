
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ContractAnalysisResult, RiskLevel } from '../types';

interface DashboardProps {
  analysis: ContractAnalysisResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const riskData = [
    { name: 'Risk Score', value: analysis.compositeRiskScore },
    { name: 'Remaining', value: 100 - analysis.compositeRiskScore }
  ];

  const getRiskColor = (score: number) => {
    if (score < 30) return '#10b981';
    if (score < 60) return '#f59e0b';
    return '#ef4444';
  };

  const criticalClauses = analysis.clauses.filter(c => c.riskLevel === RiskLevel.HIGH || c.riskLevel === RiskLevel.CRITICAL);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Widget */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Risk Profile</h3>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  innerRadius={50}
                  outerRadius={70}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                >
                  <Cell fill={getRiskColor(analysis.compositeRiskScore)} />
                  <Cell fill="#f1f5f9" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold text-slate-800">{analysis.compositeRiskScore}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-slate-600 mt-2">
            {analysis.compositeRiskScore > 70 ? 'High Risk' : analysis.compositeRiskScore > 40 ? 'Medium Risk' : 'Low Risk'}
          </p>
        </div>

        {/* Contract Identity & Parties */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Key Info</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block">Parties Involved</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {analysis.parties.map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                    {p.name} <span className="text-slate-400 italic">({p.role})</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400">Jurisdiction</label>
                <p className="text-sm font-semibold text-slate-700">{analysis.jurisdiction || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400">Governing Law</label>
                <p className="text-sm font-semibold text-slate-700">{analysis.governingLaw || 'Indian Law'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Financials</h3>
          <div className="space-y-2 overflow-y-auto max-h-40">
            {analysis.financials && analysis.financials.length > 0 ? (
              analysis.financials.map((f, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-500 truncate mr-2">{f.description}</span>
                  <span className="font-bold text-slate-800 whitespace-nowrap">{f.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No specific financial amounts detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Deadlines Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Key Dates & Deadlines</h3>
        <div className="flex flex-wrap gap-6">
          {analysis.keyDates && analysis.keyDates.length > 0 ? (
            analysis.keyDates.map((d, i) => (
              <div key={i} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 min-w-[200px]">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <i className="fas fa-calendar-day"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600">{d.date}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{d.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No key dates detected in text.</p>
          )}
        </div>
      </div>
    </div>
  );
};
