import ParticleBackground from "./components/ParticleBackground";
import MainContent from "./components/MainContent";

function App() {
  return (
    <>
      {/* 
        ParticleBackground is rendered at the root level so it 
        flows continuously behind everything, even as you scroll 
      */}
      <ParticleBackground />
      <MainContent />
    </>
  );
}

export default App;
