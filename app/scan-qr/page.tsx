'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopScanning();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasCamera(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError('Camera access denied or not available');
      setHasCamera(false);
    }
  };

  const startScanning = async () => {
    setError('');
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start QR code detection
        detectQRCode();
      }
    } catch (err) {
      setError('Unable to access camera');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const detectQRCode = async () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data from canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // In a real implementation, you would use a QR code library here
      // For now, we'll simulate QR code detection
      await simulateQRDetection();

    } catch (err) {
      console.error('QR detection error:', err);
    }

    // Continue scanning
    if (scanning) {
      setTimeout(detectQRCode, 100);
    }
  };

  const simulateQRDetection = async () => {
    // This is a placeholder for actual QR code detection
    // In a real implementation, you would use libraries like jsQR or qr-scanner

    // For demo purposes, we'll provide a manual input option
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  };

  const handleManualInput = () => {
    const qrData = prompt('Enter QR code data (for testing):');
    if (qrData) {
      processQRData(qrData);
    }
  };

  const processQRData = (qrData: string) => {
    try {
      // Parse QR data to extract type and ID
      const url = new URL(qrData);
      const pathParts = url.pathname.split('/');

      if (pathParts.length >= 4 && pathParts[1] === 'rate') {
        const type = pathParts[2];
        const id = pathParts[3];

        if ((type === 'agent' || type === 'employee') && !isNaN(parseInt(id))) {
          stopScanning();
          router.push(`/rate/${type}/${id}`);
          return;
        }
      }

      setError('Invalid QR code. Please scan a valid Alliance Insurance QR code.');
    } catch (err) {
      setError('Invalid QR code format.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-primary-600 hover:text-primary-700 mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Scan QR Code
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Camera className="mx-auto h-12 w-12 text-primary-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Scan QR Code
          </h2>
          <p className="text-gray-600">
            Point your camera at the QR code to rate an agent or employee
          </p>
        </div>

        {error && (
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            {!hasCamera ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Camera Not Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Camera access is required to scan QR codes. Please enable camera permissions or try again.
                </p>
                <button
                  onClick={checkCameraPermission}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Camera View */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    className={`w-full h-64 object-cover rounded-lg bg-gray-100 ${
                      scanning ? 'block' : 'hidden'
                    }`}
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />

                  {!scanning && (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-500">Camera ready to scan</p>
                      </div>
                    </div>
                  )}

                  {/* Scanning overlay */}
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary-500 border-dashed rounded-lg animate-pulse">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                            <p className="text-sm">Scanning...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!scanning ? (
                    <button
                      onClick={startScanning}
                      className="btn-primary"
                    >
                      Start Scanning
                    </button>
                  ) : (
                    <button
                      onClick={stopScanning}
                      className="btn-secondary"
                    >
                      Stop Scanning
                    </button>
                  )}
                </div>

                {/* Manual Input for Testing */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      For testing purposes:
                    </p>
                    <button
                      onClick={handleManualInput}
                      className="btn-secondary text-sm"
                    >
                      Enter QR Data Manually
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">How to Scan</h3>
          </div>
          <div className="card-body">
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Click "Start Scanning" to activate your camera</p>
              <p>2. Point your camera at the QR code displayed by the agent or employee</p>
              <p>3. Keep the QR code within the scanning area</p>
              <p>4. The app will automatically detect and process the QR code</p>
              <p>5. You'll be redirected to the rating page for that person</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}