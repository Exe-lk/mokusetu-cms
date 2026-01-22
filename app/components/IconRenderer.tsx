interface IconRendererProps {
  icon: string;
  className?: string;
  color?: string;
  size?: number;
}

export default function IconRenderer({ icon, className = '', color = 'currentColor', size = 24 }: IconRendererProps) {
  if (!icon) return null;

  if (icon.trim().startsWith('<svg')) {
    let processedIcon = icon.trim();
    
    processedIcon = processedIcon.replace(
      /fill=["'](?!none|currentColor)[^"']*["']/gi,
      `fill="${color}"`
    );
    
    processedIcon = processedIcon.replace(
      /stroke=["'](?!none|currentColor)[^"']*["']/gi,
      `stroke="${color}"`
    );
    
    if (!processedIcon.match(/fill=["']/i) && !processedIcon.match(/stroke=["']/i)) {
      processedIcon = processedIcon.replace(
        /(<path|<circle|<rect|<polygon|<ellipse)([^>]*>)/gi,
        (match, tag, rest) => {
          if (!rest.includes('fill=')) {
            return `${tag} fill="${color}"${rest}`;
          }
          return match;
        }
      );
    }
    
    if (!processedIcon.match(/width=["']/i)) {
      processedIcon = processedIcon.replace(/<svg([^>]*)>/i, `<svg$1 width="${size}">`);
    }
    if (!processedIcon.match(/height=["']/i)) {
      processedIcon = processedIcon.replace(/<svg([^>]*)>/i, `<svg$1 height="${size}">`);
    }
    
    return (
      <div 
        className={className}
        style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
        dangerouslySetInnerHTML={{ __html: processedIcon }}
      />
    );
  }

  return (
    <span 
      className={className} 
      style={{ 
        fontSize: `${size}px`, 
        color, 
        display: 'inline-block',
        lineHeight: 1
      }}
    >
      {icon}
    </span>
  );
}
