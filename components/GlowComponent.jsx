import React from 'react';

function GlowCircle({ color, size, blur }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 999,
        background: color,
        width: size,
        filter: `blur(${blur}px)`,
        height: size,
        overflow: 'hidden',
      }}
    />
  );
}

export default GlowCircle;
