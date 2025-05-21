'use client';

import Image from 'next/image';
import { Avatar } from 'antd';
import { useState } from 'react';

export default function OptimizedAvatar({ src, size, style, ...props }) {
  const [error, setError] = useState(false);
  
  // If there's an error loading the image or no src is provided, fall back to default Avatar
  if (error || !src) {
    return <Avatar size={size} style={style} {...props} />;
  }
  
  // Size configuration
  const dimension = typeof size === 'number' ? size : 64;
  
  return (
    <div 
      style={{ 
        position: 'relative',
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        overflow: 'hidden',
        ...style
      }}
    >
      <Image
        src={src}
        alt="avatar"
        fill
        sizes="(max-width: 768px) 64px, 64px"
        style={{ objectFit: 'cover' }}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
