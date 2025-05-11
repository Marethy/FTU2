'use client'

import styles from '@/styles/ImageWithFallback.module.css';
import { Skeleton } from 'antd';
import { useState } from 'react';

const ImageWithFallback = ({
    src,
    alt,
    fallbackSrc = '/images/placeholder.svg',
    width,
    height,
    className = '',
    style = {},
    objectFit = 'cover',
    showSkeleton = true,
    skeletonActive = true,
    onLoad,
    onError: customOnError,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoad = (e) => {
        setIsLoading(false);
        if (onLoad) onLoad(e);
    };

    const handleError = (e) => {
        setIsLoading(false);
        setHasError(true);

        // If the current source is already the fallback, don't try again
        if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
        }

        if (customOnError) customOnError(e);
    };

    // Create skeleton dimensions
    const skeletonProps = {};
    if (width) skeletonProps.width = width;
    if (height) skeletonProps.height = height;

    return (
        <div
            className={`${styles.imageContainer} ${className}`}
            style={{ width, height, ...style }}
        >
            {showSkeleton && isLoading && (
                <div className={styles.skeletonWrapper}>
                    <Skeleton.Image
                        active={skeletonActive}
                        className={styles.skeleton}
                        {...skeletonProps}
                    />
                </div>
            )}

            <img
                src={currentSrc}
                alt={alt}
                className={`${styles.image} ${isLoading ? styles.loading : ''}`}
                style={{ objectFit }}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />

            {hasError && currentSrc === fallbackSrc && (
                <div className={styles.errorOverlay}>
                    <div className={styles.errorContent}>
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.errorIcon}
                        >
                            <path
                                d="M21 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21h14a2 2 0 002-2v-4z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className={styles.errorText}>Image not available</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageWithFallback;