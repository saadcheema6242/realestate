import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { uploadAPI } from '../utils/api';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 10 }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const remainingSlots = maxImages - images.length;
        const filesToUpload = fileArray.slice(0, remainingSlots);

        if (filesToUpload.length === 0) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            filesToUpload.forEach(file => {
                formData.append('images', file);
            });

            const response = await uploadAPI.uploadImages(formData);
            const newImages = [...images, ...response.data.images];
            onImagesChange(newImages);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (indexToRemove) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        onImagesChange(newImages);
    };

    const addImageUrl = () => {
        const url = prompt('Enter image URL:');
        if (url && url.trim()) {
            const newImages = [...images, url.trim()];
            onImagesChange(newImages);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Property Images ({images.length}/{maxImages})
            </label>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image}
                                alt={`Property ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1 rounded">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {images.length < maxImages && (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />

                    <div className="space-y-2">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="text-sm text-gray-600">Uploading images...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={addImageUrl}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={images.length >= maxImages}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add URL
                </button>

                {images.length === 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        No images uploaded yet
                    </div>
                )}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500">
                <p>• First image will be used as the main property image</p>
                <p>• You can upload from your computer or add image URLs</p>
                <p>• Maximum {maxImages} images per property</p>
            </div>
        </div>
    );
};

export default ImageUpload;