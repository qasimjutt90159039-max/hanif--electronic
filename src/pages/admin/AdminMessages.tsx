import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminMessages: React.FC = () => {
  const { success } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const res = await api.getContactMessages();
      if (res.success) setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      success('Message marked as read');
      setMessages(messages.map(m => (m.id === id || m._id === id ? { ...m, status: 'read' } : m)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Customer Inquiries</h1>
        <p className="text-xs text-gray-500">Messages sent via website contact form</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => {
          const id = msg.id || msg._id || '';
          return (
            <div key={id} className={`bg-white rounded-2xl border p-5 shadow-xs transition-colors ${
              msg.status === 'unread' ? 'border-[#1261A0] bg-sky-50/20' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{msg.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {msg.phone}</span>
                    {msg.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => markRead(id)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="font-bold text-xs text-gray-800 mb-1">{msg.subject}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
