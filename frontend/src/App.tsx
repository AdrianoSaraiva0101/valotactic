import React from 'react';
import { StrategyProvider } from './state/StrategyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Viewport } from './components/Viewport';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Timeline } from './components/Timeline';
import './styles.css';

// A prop de preset de câmera é repassada ao Viewport através de um evento simples
// (CustomEvent) para não acoplar o SceneManager ao estado global do React.
function Layout() {
  const handlePreset = (preset: 'orbit' | 'top' | 'third') => {
    window.dispatchEvent(new CustomEvent('tactic3d:camera-preset', { detail: preset }));
  };

  return (
    <div className="app-grid">
      <Header onPreset={handlePreset} />
      <Sidebar />
      <Toolbar />
      <Viewport />
      <PropertiesPanel />
      <Timeline />
    </div>
  );
}

export default function App() {
  return (
    <StrategyProvider>
      <Layout />
    </StrategyProvider>
  );
}
