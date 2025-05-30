'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema, ComplaintFormData } from '@/lib/validations/schemas';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

interface Target {
  id: number;
  name: string;
  email: string;
  phone: string;
  location?: string;
  department?: string;
  position?: string;
  branch: string;
}

export default function ComplaintPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [target, setTarget] = useState<Target | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const agentId = searchParams.get('agent_id');
  const employeeId = searchParams.get('employee_id');
  const targetType = agentId ? 'agent' : employeeId ? 'employee' : null;
  const targetId = agentId || employeeId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema)
  });

  const watchedComplaintType = watch('complaint_type');

  useEffect(() => {
    if (targetType && targetId) {
      fetchTargetData();
    }
  }, [targetType, targetId]);

  const fetchTargetData = async () => {
    if (!targetType || !targetId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/${targetType}s/${targetId}`);
      if (response.ok) {
        const data = await response.json();
        setTarget(data);
      }
    } catch (error) {
      console.error('Error fetching target data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setSubmitting(true);
    try {
      const complaintData = {
        ...data,
        agent_id: agentId ? parseInt(agentId) : null,
        employee_id: employeeId ? parseInt(employeeId) : null
      };

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(complaintData)
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card">
            <div className="card-body text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complaint Submitted
              </h2>
              <p className="text-gray-600 mb-6">
                Your complaint has been submitted successfully. We will review it and get back to you soon.
              </p>
              <div className="space-y-3">
                <Link href="/" className="btn-primary w-full">
                  Back to Home
                </Link>
                <Link href="/complaint" className="btn-secondary w-full">
                  Submit Another Complaint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Submit Complaint
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Target Info */}
        {target && (
          <div className="card mb-8">
            <div className="card-body">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Complaint against {target.name}
                  </h2>
                  {targetType === 'employee' && target.position && (
                    <p className="text-gray-600">{target.position}</p>
                  )}
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-500">
                      Email: {target.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Phone: {target.phone}
                    </div>
                    {target.department && (
                      <div className="text-sm text-gray-500">
                        Department: {target.department}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Branch: {target.branch}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('complainant_name')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.complainant_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.complainant_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    {...register('complainant_email')}
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.complainant_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.complainant_email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register('complainant_phone')}
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.complainant_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.complainant_phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Number (Optional)
                  </label>
                  <input
                    {...register('policy_number')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your policy number"
                  />
                  {errors.policy_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.policy_number.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Complaint Details</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complaint Type *
                  </label>
                  <select {...register('complaint_type')} className="select-field">
                    <option value="">Select complaint type</option>
                    <option value="service">Service Quality</option>
                    <option value="billing">Billing Issue</option>
                    <option value="claim">Claim Processing</option>
                    <option value="policy">Policy Related</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.complaint_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.complaint_type.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select {...register('priority')} className="select-field">
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  className="input-field"
                  placeholder="Brief summary of your complaint"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  className="textarea-field"
                  rows={6}
                  placeholder="Please provide detailed information about your complaint..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your complaint will be reviewed by our team within 24-48 hours</li>
                    <li>You will receive email updates on the status of your complaint</li>
                    <li>For urgent matters, please call our customer service hotline</li>
                    <li>All complaints are treated confidentially</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}