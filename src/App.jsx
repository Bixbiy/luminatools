import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import JsonFormatter from './tools/dev/JsonFormatter';
import Base64Converter from './tools/dev/Base64Converter';
import HashGenerator from './tools/dev/HashGenerator';
import UuidGenerator from './tools/dev/UuidGenerator';
import CodeFormatter from './tools/dev/CodeFormatter';
import RegexTester from './tools/dev/RegexTester';
import QrGenerator from './tools/dev/QrGenerator';
import AgeCalculator from './tools/utility/AgeCalculator';
import PercentageCalculator from './tools/utility/PercentageCalculator';
import EmiCalculator from './tools/utility/EmiCalculator';
import UnitConverter from './tools/utility/UnitConverter';
import CurrencyConverter from './tools/utility/CurrencyConverter';
import MetaTagGenerator from './tools/seo/MetaTagGenerator';
import WordCounter from './tools/seo/WordCounter';
import ImageCompressor from './tools/image/ImageCompressor';
import ImageResizer from './tools/image/ImageResizer';
import ImageFormatConverter from './tools/image/ImageFormatConverter';
import PdfMerger from './tools/pdf/PdfMerger';
import PdfSplitter from './tools/pdf/PdfSplitter';
import VideoToMp3 from './tools/video/VideoToMp3';
import TextSummarizer from './tools/ai/TextSummarizer';
import KeywordExtractor from './tools/ai/KeywordExtractor';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64-converter" element={<Base64Converter />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/code-formatter" element={<CodeFormatter />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/qr-generator" element={<QrGenerator />} />

            {/* Utility Tools */}
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/emi-calculator" element={<EmiCalculator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />

            {/* SEO Tools */}
            <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />

            {/* Image Tools */}
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-format-converter" element={<ImageFormatConverter />} />

            {/* PDF Tools */}
            <Route path="/tools/pdf-merger" element={<PdfMerger />} />
            <Route path="/tools/pdf-splitter" element={<PdfSplitter />} />

            {/* Video & Audio Tools */}
            <Route path="/tools/video-to-mp3" element={<VideoToMp3 />} />

            {/* AI Tools */}
            <Route path="/tools/text-summarizer" element={<TextSummarizer />} />
            <Route path="/tools/keyword-extractor" element={<KeywordExtractor />} />

            {/* Add more routes here as we build them */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-4xl font-bold text-white mb-4">404</h2>
                <p className="text-gray-400">Page not found</p>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
