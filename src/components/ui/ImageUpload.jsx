import React, { useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

const ImageUpload = ({
  label = "Image",
  value,
  onChange,
  error,
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  preview = true,
  required = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Vérifier la taille du fichier
    if (file.size > maxSize) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Créer l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Appeler le callback onChange
    if (onChange) {
      onChange(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${error ? 'border-red-300 dark:border-red-600' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="max-w-full max-h-48 mx-auto rounded object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-gray-400">
              <Icon icon="ph:image" className="w-full h-full" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                Glissez-déposez une image ici ou{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  cliquez pour parcourir
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF jusqu'à {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message || error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
