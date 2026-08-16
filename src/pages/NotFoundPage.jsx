import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-600 mb-6">
        The requested page or route does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
