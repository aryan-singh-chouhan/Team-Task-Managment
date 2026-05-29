import React, { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import * as userApi from '../../api/user.api';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';

const MemberList = React.memo(({ members, projectId, isAdmin, onAdd, onRemove }) => {
  const { user: currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchTimeout = useRef(null);
  const currentUserId = currentUser?.id ?? currentUser?._id;

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { email: '', role: 'member' },
  });

  const handleSearch = useCallback((e) => {
    const email = e.target.value;
    setValue('email', email);
    setSelectedUser(null);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (email.length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await userApi.searchUsers(email);
        const users = Array.isArray(response?.data) ? response.data : [];
        setSearchResults(
          users.filter((u) => {
            const userId = u?.id ?? u?._id;
            return !members.some((m) => String(m?.id ?? m?._id) === String(userId));
          })
        );
      } catch (error) {
        console.error('Failed to search users:', error);
        setSearchResults([]);
      }
    }, 500);
  }, [setValue, members]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setValue('email', user.email);
    setSearchResults([]);
  };

  const handleAddMember = (data) => {
    if (!selectedUser) {
      alert('Please select a user from the search results.');
      return;
    }
    onAdd({ ...data, userId: selectedUser.id ?? selectedUser._id, projectId });
    reset();
    setShowAddForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
        {isAdmin && (
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="w-full sm:w-auto">
            <Plus size={16} className="mr-1" />
            {showAddForm ? 'Cancel' : 'Add Member'}
          </Button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit(handleAddMember)} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="User Email"
                {...register('email', { required: 'Email is required' })}
                onChange={handleSearch}
                error={errors.email}
                autoComplete="off"
                placeholder="Search by email..."
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                  {searchResults.map(user => (
                    <li 
                      key={user.id ?? user._id} 
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full sm:w-auto">Add to Project</Button>
        </form>
      )}

      <div className="space-y-3">
        {members.length > 0 ? (
          members.map(member => (
            <div key={member.id ?? member._id} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                  {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 break-all">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
                  <Badge color={member.role === 'admin' ? 'indigo' : 'gray'}>
                    {member.role}
                  </Badge>
                  {isAdmin && String(member.id ?? member._id) !== String(currentUserId) && (
                    <button
                      onClick={() => onRemove(member.id ?? member._id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove member"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No members in this project yet.</p>
        )}
      </div>
    </div>
  );
});

export default MemberList;
