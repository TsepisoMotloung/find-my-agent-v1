"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { QrCode, Download, User, Phone, Mail } from "lucide-react";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  location?: string;
  department?: string;
  position?: string;
  branch: string;
  qr_code: string;
}

export default function QRCodePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const endpoint = session?.user?.role === "agent" ? "agents" : "employees";
      const response = await fetch(`/api/dashboard/profile`);

      if (response.ok) {
        const data = await response.json();
        setProfile(data);

        // Generate QR code
        const qrResponse = await fetch(`/api/dashboard/qr-code`);
        if (qrResponse.ok) {
          const qrBlob = await qrResponse.blob();
          const qrDataURL = URL.createObjectURL(qrBlob);
          setQrCodeDataURL(qrDataURL);
        }
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL && profile) {
      const link = document.createElement("a");
      link.href = qrCodeDataURL;
      link.download = `${profile.name}-qr-code.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-500">
          Unable to load your profile information.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My QR Code</h1>
        <p className="mt-1 text-sm text-gray-500">
          Show this QR code to customers so they can rate you easily
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Display */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Your QR Code</h3>
          </div>
          <div className="card-body text-center">
            {qrCodeDataURL ? (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                  <img
                    src={qrCodeDataURL}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Customers can scan this code to rate you directly
                  </p>
                  <button onClick={downloadQRCode} className="btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Unable to generate QR code</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Your Information
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {profile.name}
                  </h4>
                  {session?.user?.role === "employee" && profile.position && (
                    <p className="text-gray-600">{profile.position}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  {profile.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-3" />
                  {profile.phone}
                </div>
                {profile.location && (
                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {profile.location}
                  </div>
                )}
                {profile.department && (
                  <div className="text-sm text-gray-600">
                    <strong>Department:</strong> {profile.department}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <strong>Branch:</strong> {profile.branch}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="card mt-8">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            How to Use Your QR Code
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Customers</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Show your QR code to customers after service</li>
                <li>• They can scan it with any QR code scanner app</li>
                <li>• They'll be taken directly to your rating page</li>
                <li>• No need to search for your name</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Display Options
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Download and print the QR code</li>
                <li>• Show it on your mobile device screen</li>
                <li>• Add it to your business cards</li>
                <li>• Display it at your desk or workstation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
