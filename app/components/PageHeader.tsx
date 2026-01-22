interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      {backgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800"></div>
      )}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl text-white/90 max-w-3xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
