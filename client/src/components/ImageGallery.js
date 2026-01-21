import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageGallery = ({ images = [], title = 'Property Images' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    // Handle both old single image format and new multiple images format
    const imageList = Array.isArray(images) ? images : [images].filter(Boolean);

    if (imageList.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    const openModal = (index) => {
        setCurrentIndex(index);
        setShowModal(true);
    };

    return (
        <>
            {/* Main Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                    <img
                        src={imageList[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        className="w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer"
                        onClick={() => openModal(currentIndex)}
                    />

                    {imageList.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                {currentIndex + 1} / {imageList.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {imageList.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {imageList.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${title} - Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${index === currentIndex
                                        ? 'ring-2 ring-primary-600 opacity-100'
                                        : 'opacity-70 hover:opacity-100'
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={imageList[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {imageList.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                                    {currentIndex + 1} / {imageList.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;