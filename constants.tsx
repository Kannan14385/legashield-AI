
import React from 'react';
import { ContractTemplate } from './types';

export const APP_NAME = "LegaShield AI";

export const MOCK_TEMPLATES: ContractTemplate[] = [
  {
    id: 'emp-001',
    title: 'Standard Employment Agreement',
    description: 'SME-friendly employment contract with standard probation and IP clauses.',
    content: `EMPLOYMENT AGREEMENT\n\nThis agreement is made on [Date] between [Employer Name] and [Employee Name]...`
  },
  {
    id: 'ven-001',
    title: 'Vendor Service Contract',
    description: 'Balanced vendor agreement focusing on delivery timelines and payment security.',
    content: `SERVICE AGREEMENT\n\nThis agreement outlines the relationship between [Client] and [Vendor] for [Services]...`
  },
  {
    id: 'nda-001',
    title: 'Mutual Non-Disclosure Agreement',
    description: 'Strict confidentiality terms to protect business trade secrets.',
    content: `NON-DISCLOSURE AGREEMENT\n\nThe parties wish to explore a business opportunity...`
  }
];

export const RISK_COLORS = {
  LOW: 'text-green-600 bg-green-50 border-green-200',
  MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
  CRITICAL: 'text-red-600 bg-red-50 border-red-200',
};
