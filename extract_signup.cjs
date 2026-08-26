const fs = require('fs');
const appLines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

const stateStartIndex = 190; // Line 191 is index 190
const stateEndIndex = 252;   // Line 253 is index 252

const stateCode = appLines.slice(stateStartIndex, stateEndIndex + 1).join('\n');

const signupTemp = fs.readFileSync('signup_temp.txt', 'utf-8').split('\n');
const jsxCode = signupTemp.slice(1, signupTemp.length - 1).join('\n');

const componentCode = `import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, UploadCloud, FileText, Camera, AlertCircle, Image as ImageIcon, UserPlus } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export interface SignupProps {
  setCurrentPage: (page: string) => void;
  setCurrentUserRole: (role: string | null) => void;
  profileData: any;
  setProfileData: (data: any) => void;
  role: 'client' | 'provider';
  setRole: (role: 'client' | 'provider') => void;
}

export default function Signup({ setCurrentPage, setCurrentUserRole, profileData, setProfileData, role, setRole }: SignupProps) {
` + stateCode + `

  return (
` + jsxCode + `
  );
}
`;

fs.writeFileSync('src/pages/Signup.tsx', componentCode);

const newAppLines = [...appLines.slice(0, stateStartIndex), ...appLines.slice(stateEndIndex + 1)];
fs.writeFileSync('src/App.tsx', newAppLines.join('\n'));
console.log('Done');
