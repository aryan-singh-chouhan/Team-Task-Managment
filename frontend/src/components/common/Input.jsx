import React from 'react';

const Input = React.memo(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3.5 py-2.5 rounded-xl text-sm
          border bg-white text-slate-900
          placeholder:text-slate-400
          transition-all duration-150 outline-none
          ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-danger-600 flex items-center gap-1">
          {typeof error === 'string' ? error : error?.message}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
