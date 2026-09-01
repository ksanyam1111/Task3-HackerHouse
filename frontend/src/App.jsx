import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, Link as LinkIcon, CheckCircle2, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Start webcam when component mounts or when we reset
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError("Failed to access webcam. Please ensure permissions are granted.");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (!preview && !result) {
      startWebcam();
    }
    return () => stopWebcam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, result]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        stopWebcam();
      }, "image/jpeg", 0.9);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/api/process-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || "An error occurred during processing.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
    setError(null);
    startWebcam();
  };

  return (
    <div className="min-h-screen py-16 px-[24px]">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-12 text-center">
          <h1>Identity Verification</h1>
          <p className="mt-4 text-geist-textSecondary">
            Scan your face to find matching social media profiles and verify them on-chain.
          </p>
        </header>

        {!result ? (
          <div className="geist-card max-w-[600px] mx-auto flex flex-col items-center">
            
            {/* Webcam / Preview Container */}
            <div className="relative w-64 h-64 mb-8 overflow-hidden rounded-full border-4 border-[#EBEBEB] bg-geist-recessed shadow-small flex items-center justify-center">
              {!preview ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]" 
                  />
                  {/* Subtle overlay guide */}
                  <div className="absolute inset-0 border-4 border-geist-blue rounded-full opacity-30 pointer-events-none"></div>
                </>
              ) : (
                <img src={preview} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
              )}
            </div>

            {/* Hidden canvas for capturing the frame */}
            <canvas ref={canvasRef} className="hidden" />
            
            {error && (
              <div className="mb-6 w-full flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-geist text-[14px]">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {!preview ? (
              <button 
                onClick={handleCapture}
                disabled={!stream}
                className={`geist-button geist-button-primary w-full max-w-[300px] ${!stream ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Face
              </button>
            ) : (
              <div className="flex gap-4 w-full max-w-[400px]">
                <button 
                  onClick={resetState}
                  disabled={loading}
                  className="geist-button geist-button-secondary flex-1"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retake
                </button>
                <button 
                  onClick={handleProcess} 
                  disabled={loading}
                  className={`geist-button geist-button-primary flex-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Verify Identity'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={resetState}
                className="text-[14px] text-geist-textSecondary hover:text-geist-text"
              >
                ← Start over
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Card */}
              <div className="geist-card flex flex-col items-center justify-center">
                 <img src={preview} alt="Input Face" className="w-48 h-48 rounded-full object-cover shadow-small mb-6 transform scale-x-[-1]" />
                 <div className="flex items-center gap-2 text-green-600 text-[14px] font-medium">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                   Face Detected & Encoded
                 </div>
              </div>
              
              {/* Match Card */}
              <div className="geist-card">
                <h3 className="text-[20px] leading-[28px] tracking-tight mb-6">Social Media Match</h3>
                
                {result.search_result.thumbnail && (
                   <img src={result.search_result.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover rounded-geist mb-6" />
                )}
                
                <h2 className="mb-2 line-clamp-2">{result.search_result.title}</h2>
                <a 
                  href={result.search_result.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-geist-blue hover:underline text-[14px] mb-6"
                >
                  <LinkIcon className="w-4 h-4" />
                  {result.search_result.source}
                </a>
                
                <div className="pt-6 border-t border-[#00000014]">
                  <h3 className="text-[20px] leading-[28px] tracking-tight mb-4">Blockchain Record</h3>
                  
                  <div className="space-y-4 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span className="text-geist-textSecondary">Status</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Verified
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-geist-textSecondary">Hash</span>
                      <code className="bg-geist-recessed px-2 py-1 rounded text-[13px] break-all border border-[#00000014]">
                        {result.blockchain_record.hash}
                      </code>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-geist-textSecondary">Transaction ID</span>
                      <a 
                        href={`https://lora.algokit.io/testnet/transaction/${result.blockchain_record.tx_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-geist-recessed px-2 py-1 rounded text-[13px] break-all border border-[#00000014] text-geist-blue hover:underline font-mono"
                      >
                        {result.blockchain_record.tx_id}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
