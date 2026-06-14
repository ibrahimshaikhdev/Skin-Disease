import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUploader({ onFileSelect, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndSet = (file) => {
    setError('');
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, WebP, or BMP.');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    validateAndSet(e.target.files[0]);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    setError('');
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${dragOver ? 'border-cyan bg-cyan/5 scale-[1.01]' : 'border-border hover:border-blue/40'} ${
          preview ? 'border-solid border-cyan' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="p-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-xl object-contain mx-auto"
              />
              <button
                onClick={handleClear}
                className="absolute -top-2 -right-2 w-7 h-7 bg-danger text-white rounded-full flex items-center justify-center shadow-lg hover:bg-danger/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mt-3 text-center">{fileName}</p>
          </div>
        ) : (
          <div className="py-16 px-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue/10 flex items-center justify-center">
              <Upload size={28} className="text-blue" />
            </div>
            <p className="text-text font-medium mb-1">
              Drag and drop your image here
            </p>
            <p className="text-text-secondary text-sm">
              or <span className="text-blue font-medium underline">browse files</span>
            </p>
            <p className="text-xs text-text-secondary/60 mt-3">
              JPG, PNG, WebP or BMP &middot; Max 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-danger text-sm mt-2 flex items-center gap-1.5">
          <X size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
