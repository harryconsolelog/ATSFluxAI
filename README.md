# ATSFlux AI Resume Checker

## 🚀 Live Demo
👉 **https://atsfluxai.netlify.app/**

A complete, production-ready full-stack ATS Resume Checker web application that uses AI to analyze resumes against job descriptions and provide detailed feedback.

## 🚀 Features

- **Resume Upload & Parsing**: Supports PDF, DOC, and DOCX files with drag-and-drop functionality
- **AI-Powered Analysis**: Uses OpenAI embeddings for semantic matching between resumes and job descriptions
- **Comprehensive ATS Scoring**: 0-100 score with detailed breakdowns across multiple factors
- **Keyword Analysis**: Identifies matched and missing keywords from job descriptions
- **Skills Assessment**: Analyzes technical skills, soft skills, and certifications
- **Formatting Analysis**: Evaluates resume formatting for ATS optimization
- **PDF Report Generation**: Downloadable professional reports with complete analysis
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Processing**: Fast analysis with visual feedback

## 🛠 Technology Stack

### Frontend
- **Next.js 16** with TypeScript and App Router
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Next.js API Routes** (serverless functions)
- **OpenAI API** for embeddings and AI analysis
- **PDF-parse** for PDF text extraction
- **Mammoth** for DOCX text extraction
- **Puppeteer** for PDF report generation

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager
- OpenAI API key

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   MAX_FILE_SIZE=10485760
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── upload/            # File upload handling
│   │   ├── analyze/           # ATS analysis endpoint
│   │   └── report/            # PDF generation
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── UploadCard.tsx        # File upload component
│   ├── JobDescription.tsx    # Job description input
│   ├── ScoreGauge.tsx        # Animated score display
│   ├── ResultCard.tsx        # Analysis results
│   ├── KeywordList.tsx       # Keyword matching display
│   ├── SuggestionsList.tsx   # Improvement suggestions
│   ├── Navbar.tsx            # Navigation header
│   └── Footer.tsx            # Footer component
├── lib/
│   ├── types.ts              # TypeScript definitions
│   ├── utils.ts              # Utility functions
│   └── constants.ts          # App constants
└── hooks/
    ├── useFileUpload.ts       # File upload logic
    ├── useATSAnalysis.ts      # Analysis state management
    └── useReportGeneration.ts # PDF report logic
```

## 🧠 How It Works

### 1. Resume Processing
- **File Upload**: Accepts PDF, DOC, DOCX files (max 10MB)
- **Text Extraction**: Uses specialized parsers for different file formats
- **Text Cleaning**: Normalizes and cleans extracted text for analysis

### 2. AI Analysis
- **Semantic Matching**: Uses OpenAI embeddings to compare resume and job description
- **Keyword Extraction**: Identifies important terms and requirements from job descriptions
- **Skills Assessment**: Matches technical skills, soft skills, and certifications
- **Formatting Analysis**: Evaluates resume structure for ATS optimization

### 3. Scoring Algorithm
The ATS score is calculated using weighted factors:
- **Semantic Similarity** (40%): AI-powered semantic matching
- **Keyword Match** (25%): Direct keyword matching
- **Skills Coverage** (20%): Skills identification and matching
- **Formatting Quality** (10%): ATS-friendly structure
- **Content Completeness** (5%): Required sections presence

### 4. Report Generation
- **Professional PDF**: Stylish, print-friendly reports
- **Comprehensive Analysis**: All scoring breakdowns and suggestions
- **Actionable Insights**: Specific recommendations for improvement

## 🔧 API Endpoints

### POST `/api/upload`
Upload and extract text from resume files.

### POST `/api/analyze`
Perform ATS analysis using AI.

### POST `/api/report`
Generate PDF report from analysis data.

## 🎨 Key Components

### UploadCard
- Drag-and-drop file upload with visual feedback
- File type and size validation
- Progress indicators and error handling

### ScoreGauge
- Animated circular progress indicator
- Color-coded score ranges
- Smooth animations and transitions

### ResultCard
- Comprehensive analysis breakdown
- Interactive progress bars
- Detailed scoring explanations

### KeywordList
- Matched vs missing keywords display
- Filterable and searchable interface
- Copy-to-clipboard functionality

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **File Type Security**: Only allowed file types accepted
- **File Size Limits**: Prevents abuse with size restrictions
- **Error Handling**: Comprehensive error responses without sensitive information

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Environment Variables for Production
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_APP_URL`: Your deployed application URL
- `MAX_FILE_SIZE`: File size limit in bytes

## 📊 Performance Optimizations

- **Lazy Loading**: Components load on demand
- **File Size Limits**: Efficient file processing
- **Response Caching**: AI analysis results cached
- **Optimized Bundling**: Split code for optimal loading

## 🧪 Testing

### Manual Testing Checklist

#### ✅ Complete ATS Analysis Flow
1. Upload a PDF resume file
2. Paste a job description
3. Submit for analysis
4. Verify ATS score appears
5. Check keyword matching results
6. Review suggestions list
7. Generate PDF report

#### ✅ File Upload Validation
1. Try uploading invalid file types (JPG, TXT)
2. Try uploading oversized files
3. Test drag-and-drop functionality
4. Test file removal before analysis

## 🔮 Future Enhancements

### Phase 2 Features
- User authentication and accounts
- Analysis history and saved results
- Multiple resume comparison
- Industry-specific scoring models
- Resume templates and builder

### Phase 3 Features
- Real-time collaboration features
- Integration with job boards
- Advanced analytics dashboard
- API for third-party integrations

## 🐛 Troubleshooting

### Common Issues

**OpenAI API Key Issues**
- Verify API key is correct and has credits
- Check environment variables are set

**File Upload Fails**
- Check file size limits
- Verify supported file types

**Build Issues**
- Clear Next.js cache: `rm -rf .next`
- Update dependencies: `npm install`

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for job seekers worldwide**
