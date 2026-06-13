import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';
import { FaCloud } from 'react-icons/fa';

const CrazyRouterTab = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('crazy_router_api_key');

    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('crazy_router_api_key', apiKey);
    window.dispatchEvent(new Event('storage'));

    // Trigger a model refresh in the UI
    window.dispatchEvent(new Event('refreshModels'));

    toast.success('CrazyRouter API Key saved successfully');
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mt-8 mb-4">
          <div
            className={classNames(
              'w-8 h-8 flex items-center justify-center rounded-lg',
              'bg-bolt-elements-background-depth-3',
              'text-purple-500',
            )}
          >
            <FaCloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-md font-medium text-bolt-elements-textPrimary">CrazyRouter Provider</h4>
            <p className="text-sm text-bolt-elements-textSecondary">Configure your CrazyRouter API key for CrazyIDE</p>
          </div>
        </div>

        <div className="space-y-4 bg-bolt-elements-background-depth-2 p-6 rounded-xl border border-bolt-elements-borderColor shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bolt-elements-textSecondary">CrazyRouter API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your CrazyRouter API Key"
                className={classNames(
                  'flex-1 px-4 py-2 rounded-lg text-sm',
                  'bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor',
                  'text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
                  'transition-all duration-200',
                )}
              />
              <button
                onClick={handleSave}
                className={classNames(
                  'px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg active:scale-95',
                )}
              >
                Save Key
              </button>
            </div>
            <p className="text-xs text-bolt-elements-textTertiary mt-2">
              Your API key is stored securely in your browser's localStorage and is never sent to our servers (BYOK
              model).
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CrazyRouterTab;
