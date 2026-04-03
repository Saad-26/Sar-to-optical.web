import { useState, useRef } from "react";
import { UploadCloud, Aperture, Activity, Loader2, ChevronRight } from "lucide-react";

const MainContent = () => {
  const [file, setFile] = useState(null);
  const [inputSrc, setInputSrc] = useState(null);
  const [outputSrc, setOutputSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testSectionRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setInputSrc(URL.createObjectURL(selectedFile));
      setOutputSrc(null); // Reset output when new file is selected
      setError(null);
    }
  };

  const handleTranslate = async () => {
    if (!file) {
      setError("Please upload a valid SAR image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutputSrc(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://sd09-sar-to-optical-api.hf.space/synthesize/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const imageBlob = await response.blob();
      setOutputSrc(URL.createObjectURL(imageBlob));
    } catch (err) {
      setError(`Inference Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTest = (e) => {
    e.preventDefault();
    testSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section 
        className="hero" 
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative' }}
      >
        <div className="glass-panel" style={{ maxWidth: '800px', padding: '50px', textAlign: 'center', animation: 'fadeIn 1s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '50%' }}>
              <Aperture size={48} color="#60a5fa" />
            </div>
          </div>
          
          <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', letterSpacing: '-1px', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SAR to Optical Translation
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '30px', lineHeight: '1.6' }}>
            Synthetic Aperture Radar (SAR) provides critical all-weather earth observation but is notoriously difficult to interpret. We implemented an <strong>S-CycleGAN</strong> architecture to translate these complex radar backscatters into intuitive, natural-color optical imagery in real-time.
          </p>

          <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '12px', marginBottom: '40px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#e2e8f0' }}>
                <Activity color="#3b82f6" size={24} />
                <span><strong>Model Specification:</strong> Trained extensively on the Agriculture Land SAR dataset for exceptional texture preservation and color accuracy.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#e2e8f0' }}>
                <UploadCloud color="#3b82f6" size={24} />
                <span><strong>Web Integration:</strong> Engineered as a scalable backend service connected to this highly responsive front-end interface.</span>
              </li>
            </ul>
          </div>

          <a href="#test" onClick={scrollToTest} className="btn">
            Test the Model
            <ChevronRight size={20} />
          </a>
        </div>
      </section>

      <section ref={testSectionRef} id="test" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '1000px', width: '100%', padding: '60px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '10px' }}>Synthesize Live Data</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>Upload a SAR image tensor to see our S-CycleGAN in action</p>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', marginBottom: '50px' }}>
              <button 
                type="button"
                onClick={() => document.getElementById('hiddenFileInput').click()}
                className="btn"
              >
                <UploadCloud size={20} />
                <span>{file ? (file.name.length > 20 ? file.name.substring(0,20)+'...' : file.name) : "Choose SAR Image..."}</span>
              </button>
              <input 
                id="hiddenFileInput"
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button className="btn" onClick={handleTranslate} disabled={loading || !file} style={{ padding: '16px 36px' }}>
                {loading ? <><Loader2 className="animate-spin" size={20}/> Translating...</> : "Translate Image"}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
               {/* Input Card */}
               <div style={{ textAlign: 'left' }}>
                 <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#f8fafc', opacity: 0.8 }}>Input (SAR)</h3>
                 <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '16px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    {inputSrc ? (
                      <img src={inputSrc} alt="SAR Input" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '10px' }}>
                        <Aperture size={32} opacity={0.3} />
                        <span>No image selected</span>
                      </div>
                    )}
                 </div>
               </div>

               {/* Output Card */}
               <div style={{ textAlign: 'left' }}>
                 <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#f8fafc', opacity: 0.8 }}>Output (Optical)</h3>
                 <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '16px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    {loading && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                      </div>
                    )}
                    {outputSrc ? (
                      <img src={outputSrc} alt="Optical Output" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '10px' }}>
                        <Activity size={32} opacity={0.3} />
                        <span>Awaiting Translation...</span>
                      </div>
                    )}
                 </div>
               </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default MainContent;
