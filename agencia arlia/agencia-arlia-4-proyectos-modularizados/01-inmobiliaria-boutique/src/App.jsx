import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CatalogView from './components/CatalogView';
import MortgageSimulator from './components/MortgageSimulator';
import AdminPanel from './components/AdminPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_PROPERTIES } from './data/initialProperties';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [properties, setProperties] = useLocalStorage('arlia_boutique_props_v1', INITIAL_PROPERTIES);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-zinc-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'catalog' && <CatalogView properties={properties} />}
        {activeTab === 'mortgage' && <MortgageSimulator />}
        {activeTab === 'admin' && (
          <AdminPanel properties={properties} setProperties={setProperties} />
        )}
      </main>
    </div>
  );
}
