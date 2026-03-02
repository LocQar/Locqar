import React, { useState } from 'react';
import { X, Save, Calendar, Clock, User, FileText, Phone, Mail, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CRM_ACTIVITY_TYPES } from '../../constants/mockDataCRM';

export const NewActivityDrawer = ({ isOpen, onClose, onSave }) => {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    type: 'call',
    subject: '',
    description: '',
    contactName: '',
    dealTitle: '',
    assignedTo: 'Ama Owusu',
    status: 'scheduled',
    dueDate: '',
    dueTime: ''
  });

  const handleSubmit = () => {
    if (!form.subject || !form.dueDate) {
      alert('Please fill in subject and due date');
      return;
    }

    const newActivity = {
      ...form,
      id: `A${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: form.status === 'completed' ? new Date().toISOString().split('T')[0] : null
    };

    onSave?.(newActivity);
    setForm({
      type: 'call', subject: '', description: '', contactName: '',
      dealTitle: '', assignedTo: 'Ama Owusu', status: 'scheduled',
      dueDate: '', dueTime: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.border.primary,
    color: theme.text.primary
  };

  const activityIcons = {
    call: Phone,
    email: Mail,
    meeting: Users,
    task: CheckCircle,
    note: FileText
  };

  const ActivityIcon = activityIcons[form.type];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>CRM</p>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Schedule Activity</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Activity Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Activity Type</h3>

          <div className="grid grid-cols-5 gap-2">
            {Object.entries(CRM_ACTIVITY_TYPES).map(([key, { label, color, bg }]) => {
              const Icon = activityIcons[key];
              const isActive = form.type === key;
              return (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, type: key })}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isActive ? color : theme.border.primary,
                    backgroundColor: isActive ? bg : 'transparent'
                  }}
                >
                  <Icon size={20} style={{ color: isActive ? color : theme.text.secondary }} />
                  <span className="text-xs font-medium" style={{ color: isActive ? color : theme.text.secondary }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Details</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              Subject *
            </label>
            <input
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder={
                form.type === 'call' ? 'e.g. Follow-up call with prospect' :
                form.type === 'email' ? 'e.g. Send proposal to client' :
                form.type === 'meeting' ? 'e.g. Product demo meeting' :
                form.type === 'task' ? 'e.g. Prepare contract documents' :
                'e.g. Meeting notes'
              }
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <FileText size={14} className="inline mr-1" />
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details about this activity..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <User size={14} className="inline mr-1" />
                Contact
              </label>
              <input
                value={form.contactName}
                onChange={e => setForm({ ...form, contactName: e.target.value })}
                placeholder="Contact name"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                Related Deal
              </label>
              <input
                value={form.dealTitle}
                onChange={e => setForm({ ...form, dealTitle: e.target.value })}
                placeholder="Deal title"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Schedule</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Calendar size={14} className="inline mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Clock size={14} className="inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={form.dueTime}
                onChange={e => setForm({ ...form, dueTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                Assign To
              </label>
              <select
                value={form.assignedTo}
                onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
              >
                <option value="Ama Owusu">Ama Owusu</option>
                <option value="Daniel Boateng">Daniel Boateng</option>
                <option value="Kwame Asante">Kwame Asante</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-3 text-xs border"
          style={{
            backgroundColor: CRM_ACTIVITY_TYPES[form.type].bg,
            borderColor: CRM_ACTIVITY_TYPES[form.type].color + '40',
            color: CRM_ACTIVITY_TYPES[form.type].color
          }}
        >
          <ActivityIcon size={16} className="inline mr-1" />
          <strong>Creating a {CRM_ACTIVITY_TYPES[form.type].label.toLowerCase()}.</strong> This will be added to your activity timeline.
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: theme.border.primary }}>
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
        >
          <Save size={18} />
          Save Activity
        </button>
      </div>
    </div>
  );
};
