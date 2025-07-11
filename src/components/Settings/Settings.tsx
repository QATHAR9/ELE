import React from 'react';

export default function Settings() {

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-elegant-black">Settings</h2>

      {/* System Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-elegant-black mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Currency</h4>
              <p className="text-sm text-gray-600">Default currency for the system</p>
            </div>
            <select className="input-field">
              <option value="KSh">Kenyan Shilling (KSh)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Low Stock Notifications</h4>
              <p className="text-sm text-gray-600">Get notified when products are running low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-backup</h4>
              <p className="text-sm text-gray-600">Automatically backup data daily</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-elegant-black mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              className="input-field w-full"
              defaultValue="Gents by Elegante"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              className="input-field w-full"
              defaultValue="info@gentselegante.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="input-field w-full"
              defaultValue="+254 700 000 000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              className="input-field w-full"
              defaultValue="Nairobi, Kenya"
            />
          </div>
        </div>
        <button className="btn-primary mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
}