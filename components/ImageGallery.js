import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ImageGallery({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showModal, setShowModal] = useState(false)

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
            </div>
        )
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const openModal = (index) => {
        setCurrentIndex(index)
        setShowModal(true)
    }

    return (
        <>
            {/* Main Gallery */}
            <div className="grid grid-cols-4 gap-2 h-64">
                {/* Main Image */}
                <div className="col-span-3 relative rounded-lg overflow-hidden cursor-pointer">
                    <Image
                        src={images[currentIndex]}
                        alt="Property main view"
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        onClick={() => openModal(currentIndex)}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="flex flex-col gap-2">
                    {images.slice(0, 4).map((image, index) => (
                        <div
                            key={index}
                            className={`relative h-14 rounded overflow-hidden cursor-pointer ${index === currentIndex ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <Image
                                src={image}
                                alt={`Property view ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform"
                            />
                            {index === 3 && images.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold">
                                    +{images.length - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative">
                            <Image
                                src={images[currentIndex]}
                                alt="Property full view"
                                width={800}
                                height={600}
                                className="object-contain max-h-[80vh]"
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}