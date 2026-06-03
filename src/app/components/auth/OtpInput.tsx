import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val.slice(-1); // Keep only last character
    onChange(newOtp);

    // Auto-move to next field
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous field if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOtp = [...value];
        newOtp[index] = '';
        onChange(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.replace(/\D/g, '').slice(0, length).split('');

    if (pastedOtp.length === length) {
      onChange(pastedOtp);
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};
