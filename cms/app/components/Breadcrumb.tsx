interface BreadcrumbProps {
  currentPage: string;
  currentPagePath: string;
  parentPage: string;
  parentPagePath: string;
}

export default function Breadcrumb({ currentPage, currentPagePath, parentPage, parentPagePath }: BreadcrumbProps) {
  return (
    <nav className="bg-gray-50 py-4 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center space-x-2 text-sm">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <span className="text-gray-400">/</span>
          <a href={parentPagePath} className="text-gray-600 hover:text-gray-900">{parentPage}</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{currentPage}</span>
        </div>
      </div>
    </nav>
  );
}
