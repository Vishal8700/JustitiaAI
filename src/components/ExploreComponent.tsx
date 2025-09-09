import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  FileText,
  Scale,
  Gavel,
  Users,
  Building,
  Shield,
  Heart,
  Briefcase,
  Home,
  Car,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

interface LawBook {
  id: string;
  title: string;
  description: string;
  category: string;
  pdfUrl: string;
  pages: number;
  lastUpdated: string;
  icon: React.ReactNode;
}

interface LegalAct {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  pdfLink: string;
  ministry: string;
}

const ExplorePage: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('acts');

  // Sample law books data
  const lawBooks: LawBook[] = [
    {
      id: '1',
      title: 'Indian Penal Code (IPC) - Complete Guide',
      description: 'Comprehensive guide to the Indian Penal Code covering all sections, amendments, and case studies.',
      category: 'Criminal Law',
      pdfUrl: '/pdfs/download2.pdf',
      pages: 450,
      lastUpdated: '2024-01-15',
      icon: <Scale className="w-6 h-6" />
    },
    {
      id: '2',
      title: 'Constitution of India - Annotated Version',
      description: 'Complete Constitution of India with detailed annotations, amendments, and explanatory notes.',
      category: 'Constitutional Law',
      pdfUrl: '/pdfs/download1.pdf',
      pages: 650,
      lastUpdated: '2024-02-10',
      icon: <Building className="w-6 h-6" />
    }
  ];

  // Sample Indian legal acts data
  const legalActs: LegalAct[] = [
    {
      id: '1',
      title: 'Constitution of India',
      year: '1949',
      category: 'Judiciary Law',
      description: 'The supreme law of India laying down the framework for governance',
      pdfLink: 'https://legislative.gov.in/constitution-of-india',
      ministry: 'Ministry of Law and Justice'
    },
    {
      id: '2',
      title: 'The Contempt of Courts Act',
      year: '1971',
      category: 'Judiciary Law',
      description: 'Defines and limits the powers of courts in punishing acts of contempt',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2023/06/2023062185.pdf',
      ministry: 'Ministry of Law and Justice'
    },
    {
      id: '3',
      title: 'The Court Fees Act',
      year: '1870',
      category: 'Civil Law',
      description: 'Provides for fees to be paid in courts and public offices',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2022/06/2022062088.pdf',
      ministry: 'Ministry of Law and Justice'
    },
    {
      id: '4',
      title: 'The Judges (Protection) Act',
      year: '1985',
      category: 'Judiciary Law',
      description: 'Provides protection to judges for actions taken in the discharge of duties',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2021/08/2021082393.pdf',
      ministry: 'Appointments Division, Ministry of Law and Justice'
    },
    {
      id: '5',
      title: 'The Judges Inquiry Act',
      year: '1968',
      category: 'Judiciary Law',
      description: 'Provides procedure for investigation into misbehaviour or incapacity of judges',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2021/08/2021082356.pdf',
      ministry: 'Appointments Division, Ministry of Law and Justice'
    },
    {
      id: '6',
      title: 'The Gram Nyayalayas Act',
      year: '2008',
      category: 'Rural Justice',
      description: 'Establishes village-level courts to provide justice to rural citizens',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2021/08/2021082356.pdf',
      ministry: 'National Mission for Justice Delivery & Legal Reforms'
    },
    {
      id: '7',
      title: 'The Legal Services Authorities Act',
      year: '1987',
      category: 'Legal Aid',
      description: 'Provides free and competent legal services to weaker sections of society',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2021/08/2021082333.pdf',
      ministry: 'National Legal Services Authority'
    },
    {
      id: '8',
      title: 'The Family Courts Act',
      year: '1984',
      category: 'Family Law',
      description: 'Provides for establishment of Family Courts to promote conciliation and secure speedy settlement of disputes',
      pdfLink: 'https://cdnbbsr.s3waas.gov.in/s35d6646aad9bcc0be55b2c82f69750387/uploads/2021/08/2021082371.pdf',
      ministry: 'Ministry of Law and Justice'
    }
  ];

  const categories = ['all', 'Criminal Law', 'Civil Law', 'Constitutional Law', 'Evidence Law', 'Women Rights', 'Transparency', 'Judiciary Law', 'Rural Justice', 'Legal Aid', 'Family Law'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Criminal Law': return <Gavel className="w-4 h-4" />;
      case 'Civil Law': return <Users className="w-4 h-4" />;
      case 'Constitutional Law': return <Building className="w-4 h-4" />;
      case 'Evidence Law': return <FileText className="w-4 h-4" />;
      case 'Women Rights': return <Heart className="w-4 h-4" />;
      case 'Transparency': return <Globe className="w-4 h-4" />;
      case 'Judiciary Law': return <Scale className="w-4 h-4" />;
      case 'Rural Justice': return <Home className="w-4 h-4" />;
      case 'Legal Aid': return <Shield className="w-4 h-4" />;
      case 'Family Law': return <Heart className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredBooks = lawBooks.filter(book => 
    (selectedCategory === 'all' || book.category === selectedCategory) &&
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActs = legalActs.filter(act => 
    (selectedCategory === 'all' || act.category === selectedCategory) &&
    act.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPDF = (pdfUrl: string, title: string) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white dark:bg-[#1f1f1f]">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl">
                <img 
                  src="./law.png" 
                  alt="DOJ Emblem" 
                  className="w-12 h-16 dark:invert"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Explorer</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive collection of Indian law books and legal acts</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(actualTheme === "light" ? "dark" : "light")}
              className="w-8 h-8 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search law books and acts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-white dark:bg-[#2d2d2d]">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 rounded-xl w-fit bg-gray-100 dark:bg-[#2d2d2d]">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'books'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Law Books
            </button>
            <button
              onClick={() => setActiveTab('acts')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'acts'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Indian Legal Acts
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-8">
        {activeTab === 'books' && (
          <div>
            {/* Law Books Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white dark:bg-[#2d2d2d] rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                        <div className="text-blue-600 dark:text-blue-400">
                          {book.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{book.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{book.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                            {getCategoryIcon(book.category)}
                            {book.category}
                          </span>
                          <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                            {book.pages} pages
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Updated: {new Date(book.lastUpdated).toLocaleDateString()}
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => openPDF(book.pdfUrl, book.title)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              Read
                            </button>
                            <a
                              href={book.pdfUrl}
                              download
                              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'acts' && (
          <div>
            {/* DOJ Reference */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="./law.png"
                  alt="indianlaw"
                  className="w-12 h-16"
                />
                <div>
                  <h2 className="text-2xl font-bold">Department of Justice, India</h2>
                  <p className="text-blue-100 mt-1">Official source for Indian legal acts and rules</p>
                </div>
              </div>
              <a
                href="https://doj.gov.in/acts-and-rules/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Official Website
              </a>
            </div>

            {/* Legal Acts Table */}
            <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Indian Legal Acts & Rules</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Comprehensive collection of Indian legal acts</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Act</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ministry</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#2d2d2d] divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActs.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-8 py-6">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{act.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{act.description}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white font-medium">{act.year}</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                            {getCategoryIcon(act.category)}
                            {act.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{act.ministry}</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <a
                            href={act.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            View PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredActs.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No acts found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
