'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { parseApiResponse } from '@/lib/api-response';
import type { UtmAttribution } from '@/lib/utm';
import { courses } from '@/data/courses';

interface ApplicationData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  program: string;
  qualification?: string;
  preferredUniversity?: string;
  budget?: string;
  customBudget?: string;
  preferredSession?: string;
  customPreferredSession?: string;
  lastPassingPercentage?: string;
  callbackDate?: string;
  callbackTime?: string;
  leadSource?: string;
  utmAttribution?: UtmAttribution;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportFromDate, setExportFromDate] = useState('');
  const [exportToDate, setExportToDate] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      const result = await parseApiResponse<{ success?: boolean; data?: ApplicationData[]; error?: string }>(response);
      
      if (result.success) {
        setApplications(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch applications');
      }
    } catch (error) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status } : app
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const exportLeadsToExcel = async () => {
    setExportError(null);

    const startTimestamp = exportFromDate
      ? new Date(`${exportFromDate}T00:00:00`).getTime()
      : Number.NEGATIVE_INFINITY;
    const endTimestamp = exportToDate
      ? new Date(`${exportToDate}T23:59:59.999`).getTime()
      : Number.POSITIVE_INFINITY;

    if (startTimestamp > endTimestamp) {
      setExportError('The From date must be before or equal to the To date.');
      return;
    }

    const exportParameters = new URLSearchParams({ export: '1' });
    if (exportFromDate) {
      exportParameters.set('from', String(startTimestamp));
    }
    if (exportToDate) {
      exportParameters.set('to', String(endTimestamp));
    }

    let applicationsToExport: ApplicationData[];
    try {
      const response = await fetch(`/api/applications?${exportParameters}`);
      const result = await parseApiResponse<{
        success?: boolean;
        data?: ApplicationData[];
        error?: string;
      }>(response);

      if (!response.ok || !result.success) {
        setExportError(result.error || 'Unable to prepare the lead export.');
        return;
      }
      applicationsToExport = result.data || [];
    } catch {
      setExportError('Unable to prepare the lead export. Please try again.');
      return;
    }

    if (applicationsToExport.length === 0) {
      setExportError('No leads were found for the selected date range.');
      return;
    }

    const headers = [
      'Lead ID', 'Full Name', 'Email', 'Phone', 'State', 'Qualification',
      'Course', 'Preferred University', 'Total Budget', 'Preferred Session',
      'Last Passing Percentage', 'Callback Date', 'Callback Time',
      'Lead Source', 'Status', 'Applied At', 'First UTM Source',
      'First UTM Medium', 'First UTM Campaign', 'First Landing Page',
      'Last UTM Source', 'Last UTM Medium', 'Last UTM Campaign',
      'Last Landing Page',
    ];

    const escapeCell = (value: unknown) => {
      let text = value == null ? '' : String(value);

      // Prevent user-controlled values from becoming Excel formulas.
      if (/^[=+\-@]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = applicationsToExport.map((application) => {
      const selectedCourse = courses.find(
        (course) => course.id === application.program,
      );
      const courseName = selectedCourse
        ? `${selectedCourse.title} - ${selectedCourse.university}`
        : application.program;
      const budget =
        application.budget === 'Custom amount' && application.customBudget
          ? `₹${Number(application.customBudget).toLocaleString('en-IN')}`
          : application.budget;

      return [
        application.id,
        application.fullName,
        application.email,
        application.phone,
        application.state,
        application.qualification,
        courseName,
        application.preferredUniversity,
        budget,
        application.preferredSession === 'Custom session'
          ? application.customPreferredSession
          : application.preferredSession,
        application.lastPassingPercentage,
        application.callbackDate,
        application.callbackTime,
        application.leadSource,
        application.status,
        new Date(application.timestamp).toISOString(),
        application.utmAttribution?.firstTouch.source,
        application.utmAttribution?.firstTouch.medium,
        application.utmAttribution?.firstTouch.campaign,
        application.utmAttribution?.firstTouch.landingPath,
        application.utmAttribution?.lastTouch.source,
        application.utmAttribution?.lastTouch.medium,
        application.utmAttribution?.lastTouch.campaign,
        application.utmAttribution?.lastTouch.landingPath,
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(','))
      .join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const rangeLabel =
      exportFromDate || exportToDate
        ? `${exportFromDate || 'beginning'}-to-${exportToDate || 'latest'}`
        : new Date().toISOString().slice(0, 10);
    link.download = `edubh-leads-${rangeLabel}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3EC3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchApplications}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Applications Dashboard</h2>
        <button
          type="button"
          onClick={fetchApplications}
          className="rounded-lg bg-[#1A3EC3] px-4 py-2 text-white transition-colors hover:bg-[#4F46E5]"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            From date
            <input
              type="date"
              value={exportFromDate}
              max={exportToDate || undefined}
              onChange={(event) => {
                setExportFromDate(event.target.value);
                setExportError(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            To date
            <input
              type="date"
              value={exportToDate}
              min={exportFromDate || undefined}
              onChange={(event) => {
                setExportToDate(event.target.value);
                setExportError(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={exportLeadsToExcel}
            disabled={applications.length === 0}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download Selected Leads
          </button>
          <button
            type="button"
            onClick={() => {
              setExportFromDate('');
              setExportToDate('');
              setExportError(null);
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Clear dates
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Leave both dates empty to download all leads.
        </p>
        {exportError && (
          <p className="mt-2 text-sm font-medium text-red-600">{exportError}</p>
        )}
      </div>

<div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counselling Preferences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application, index) => (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullName}
                      </div>
                      {application.qualification && (
                        <div className="text-sm text-gray-500">
                          {application.qualification}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {application.state}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.program}
                      </span>
                      {application.leadSource && (
                        <div className="text-xs text-gray-500">
                          Source: {application.leadSource}
                        </div>
                      )}
                    </div>
                  </td>                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="min-w-[220px] space-y-1">
                      <p><span className="font-medium text-gray-800">University:</span> {application.preferredUniversity || "Not provided"}</p>
                      <p><span className="font-medium text-gray-800">Budget:</span> {application.budget === "Custom amount" && application.customBudget ? `₹${Number(application.customBudget).toLocaleString("en-IN")}` : application.budget || "Not provided"}</p>
                      <p><span className="font-medium text-gray-800">Session:</span> {application.preferredSession === "Custom session" ? application.customPreferredSession || "Not provided" : application.preferredSession || "Not provided"}</p>
                      <p><span className="font-medium text-gray-800">Last percentage:</span> {application.lastPassingPercentage ? `${application.lastPassingPercentage}%` : "Not provided"}</p>
                      <p><span className="font-medium text-gray-800">Callback date:</span> {application.callbackDate || "Not provided"}</p>

                      <p><span className="font-medium text-gray-800">Callback:</span> {application.callbackTime || "Not provided"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.email}</div>
                    <div className="text-sm text-gray-500">{application.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={application.status}
                        onChange={(e) => updateStatus(application.id, e.target.value as 'pending' | 'approved' | 'rejected')}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
